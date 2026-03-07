import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose Your Store | NextCommerce",
  description: "Select HEIM Kitchenware or Kinder Footwear to start shopping.",
};

export default function HomePage() {
  return (
    <main className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-dark">
      {/* Kinder Section */}
      <Link
        href="/kinder"
        className="group relative flex-1 h-1/2 md:h-full md:hover:flex-[1.3] transition-all duration-700 ease-in-out overflow-hidden"
      >
        <Image
          src="/kinder_footwear_big_logo.jpeg"
          alt="Kinder Footwear"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 z-0"
          priority
        />
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8">
          <div className="bg-dark/90 backdrop-blur-sm p-10 rounded-xl shadow-lg transform transition-all duration-500 translate-y-0 group-hover:-translate-y-4 text-center text-white max-w-lg">
            <span className="inline-block px-3 py-1 mb-4 border border-white/30 rounded-full text-xs uppercase tracking-widest backdrop-blur-sm">
              Kids & Fashion
            </span>
            <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight font-serif">
              Kinder
            </h2>
            <p className="text-lg md:text-xl text-white/90 mx-auto opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
              Comfort and style for the little ones.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider border-b border-transparent group-hover:border-white transition-all duration-300 pb-1">
              Enter Store
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </Link>

      {/* HEIM Section */}
      <Link
        href="/heim"
        className="group relative flex-1 h-1/2 md:h-full md:hover:flex-[1.3] transition-all duration-700 ease-in-out overflow-hidden"
      >
        <Image
          src="/heim_kitchenware_big_logo.jpeg"
          alt="HEIM Kitchenware"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 z-0"
          priority
        />
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8">
          <div className="bg-orange/90 backdrop-blur-sm p-10 rounded-xl shadow-lg transform transition-all duration-500 translate-y-0 group-hover:-translate-y-4 text-center text-white max-w-lg">
            <span className="inline-block px-3 py-1 mb-4 border border-white/30 rounded-full text-xs uppercase tracking-widest backdrop-blur-sm">
              Kitchen & Home
            </span>
            <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight font-serif">
              HEIM
            </h2>
            <p className="text-lg md:text-xl text-white/90 mx-auto opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
              Elevate your culinary experience with premium kitchenware.
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider border-b border-transparent group-hover:border-white transition-all duration-300 pb-1">
              Enter Store
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </main>
  );
}
