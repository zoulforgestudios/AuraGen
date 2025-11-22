import { useState } from 'react';
import { SearchSection } from './components/SearchSection';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0C0E14] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-16">
          <h1 className="mb-4 bg-gradient-to-r from-white to-[#00D9FF] bg-clip-text text-transparent">
            AuraGen
          </h1>
          <p className="text-[#00D9FF] text-sm tracking-wider mb-12">
            Your question → our bridge → knowledge.
          </p>
          
          <h2 className="mb-4">
            Ask anything. Get instant knowledge.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We explore multiple knowledge sources and deliver one clean, easy-to-read summary.
          </p>
        </div>

        {/* Search/Chat Section */}
        <SearchSection />
      </div>

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Footer */}
      <Footer />
    </div>
  );
}