import { MessageSquare, Search, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Ask a question',
    description: 'Type your question in plain English',
  },
  {
    number: '02',
    icon: Search,
    title: 'We explore 10+ sources',
    description: 'Searches Wikipedia, Reddit, Pokémon, Minecraft, News & more',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Get one unified summary',
    description: 'Clean, combined answer with the most important details',
  },
];

export function HowItWorks() {
  return (
    <div className="py-20 bg-gradient-to-b from-transparent to-[#0C0E14]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">How it works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Three simple steps to unlock knowledge from the world's largest encyclopedia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#00D9FF]/50 to-transparent"></div>
                )}

                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#00D9FF]/20 to-transparent border border-[#00D9FF]/30 rounded-2xl flex items-center justify-center mx-auto">
                      <Icon className="size-12 text-[#00D9FF]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#00D9FF] rounded-full flex items-center justify-center">
                      <span className="text-sm text-[#0C0E14]">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-[#00D9FF] to-[#0099FF] rounded-full 
                     hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all duration-300"
          >
            Start asking now
          </button>
        </div>
      </div>
    </div>
  );
}