// lib/auth.ts
// ============================================================
// Auth helper functions shared across pages.
// Handles login, signup, logout, and profile fetching.
// ============================================================
import { createClient } from "./supabase";
import type { UserRole } from "@/types";

/**
 * Sign in with email + password.
 * Returns { user, profile, error }
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { user: null, profile: null, error: parseAuthError(error?.message) };
  }

  // Fetch the user's role profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    // Profile doesn't exist yet — create it
    await supabase.from("profiles").insert({
      id:        data.user.id,
      full_name: data.user.user_metadata?.full_name ?? "",
      role:      data.user.user_metadata?.role ?? "buyer",
    });
  }

  return { user: data.user, profile, error: null };
}

/**
 * Sign up a new user with role metadata.
 * Supabase trigger auto-creates the profile row.
 */
export async function signUp(
  email:       string,
  password:    string,
  fullName:    string,
  companyName: string,
  role:        UserRole
) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name:    fullName,
        company_name: companyName,
        role,
      },
      // For development — disable email confirmation requirement
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    return { user: null, error: parseAuthError(error.message) };
  }

  return { user: data.user, error: null };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/**
 * Get current session user + their profile.
 * Returns null if not authenticated.
 */
export async function getCurrentUser() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

/**
 * Converts raw Supabase error messages into user-friendly strings.
 */
function parseAuthError(message?: string): string {
  if (!message) return "An unexpected error occurred. Please try again.";

  const map: Record<string, string> = {
    "Invalid login credentials":           "Incorrect email or password. Please try again.",
    "Email not confirmed":                 "Please check your email and click the confirmation link before signing in.",
    "User already registered":             "An account with this email already exists. Try signing in instead.",
    "Password should be at least 6 characters": "Password must be at least 6 characters long.",
    "Unable to validate email address":    "Please enter a valid email address.",
    "signup is disabled":                  "New registrations are temporarily disabled. Please contact support.",
    "email rate limit exceeded":           "Too many attempts. Please wait a few minutes and try again.",
  };

  for (const [key, friendly] of Object.entries(map)) {
    if (message.toLowerCase().includes(key.toLowerCase())) return friendly;
  }

  return message;
}