import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 overflow-hidden relative font-sans">
      
      {/* Soft, organic background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-200/40 blur-[100px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-100/50 blur-[120px] -z-10"></div>

      {/* Glass Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-2xl rotate-3 shadow-md flex items-center justify-center text-white font-black text-xl">E</div>
            <span className="font-extrabold text-2xl text-stone-900 tracking-tight">EcoPack</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-stone-500 hover:text-amber-700 font-bold transition-colors">Sign In</Link>
            <Link href="/signup" className="bg-stone-900 text-white hover:bg-stone-800 font-bold px-6 py-2.5 rounded-full transition-all shadow-md hover:-translate-y-0.5">Join the Network</Link>
          </div>
        </div>
      </nav>

      {/* Warm Hero Section */}
      <div className="pt-40 pb-16 px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-sm font-bold">Small farms, big buying power.</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 mb-6 tracking-tight">
          Smarter Packaging. <br />
          <span className="text-amber-600">Together.</span>
        </h1>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Why pay retail? Pool your packaging orders with other local agro-processors to unlock massive wholesale discounts. 
        </p>
      </div>

      {/* Playful Split Gateway */}
      <div className="max-w-5xl mx-auto px-4 pb-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Buyer Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform origin-left">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 mb-3">I want to Buy</h2>
              <p className="text-stone-500 font-medium mb-8 leading-relaxed">
                Source eco-friendly boxes and bags. Join active bulk pools to drop your costs instantly. Perfect for co-ops!
              </p>
            </div>
            <Link href="/dashboard" className="w-full text-center bg-amber-100 text-amber-800 font-bold py-4 rounded-2xl hover:bg-amber-200 transition-colors">
              Browse Catalog &rarr;
            </Link>
          </div>

          {/* Seller Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 hover:shadow-xl hover:border-stone-300 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 bg-stone-100 text-stone-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform origin-left">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 mb-3">I want to Sell</h2>
              <p className="text-stone-500 font-medium mb-8 leading-relaxed">
                Are you a verified manufacturer? List your inventory here and let our aggregation engine bring the buyers to you.
              </p>
            </div>
            <Link href="/seller-dashboard" className="w-full text-center bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-stone-800 transition-colors">
              Open Storefront &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}