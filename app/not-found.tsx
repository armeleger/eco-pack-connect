import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center font-sans p-4">
      <div className="text-center">
        <div className="text-amber-600 font-black text-9xl mb-4 opacity-20">404</div>
        <h1 className="text-3xl font-extrabold text-stone-900 mb-2">System Route Not Found</h1>
        <p className="text-stone-500 font-medium mb-8">The page you are looking for does not exist in the EcoPack architecture.</p>
        <Link href="/" className="bg-stone-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-stone-800 transition shadow-md">
          Return to Hub
        </Link>
      </div>
    </div>
  );
}