import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-green-800 tracking-tight">
          Welcome to EcoPack Connect
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          The B2B marketplace powering sustainable packaging for African agro-processors through smart bulk aggregation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/signup" 
            className="px-8 py-3 text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="px-8 py-3 text-lg font-medium rounded-md text-green-700 bg-white border-2 border-green-600 hover:bg-green-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}