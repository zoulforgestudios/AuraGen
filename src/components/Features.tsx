import { Zap, BookOpen, Link2, Database } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Searches 10+ knowledge sources',
    description: 'Explores Wikipedia, Reddit, Pokémon, News, Sports & more',
  },
  {
    icon: Zap,
    title: 'One clean summary',
    description: 'Combines findings into a single easy-to-read answer',
  },
  {
    icon: BookOpen,
    title: 'No duplicates or clutter',
    description: 'Removes repeated information across sources',
  },
  {
    icon: Link2,
    title: 'No login, no signup — just ask',
    description: 'Start learning immediately, no barriers',
  },
];

export function Features() {
  return (
    <div className="py-20 border-t border-[#00D9FF]/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-[#1A1D29] border border-[#00D9FF]/20 rounded-2xl p-6 
                         hover:border-[#00D9FF]/50 hover:shadow-[0_0_30px_rgba(0,217,255,0.2)] 
                         transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#00D9FF]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="size-6 text-[#00D9FF]" />
                </div>
                <h4 className="mb-2 text-white">{feature.title}</h4>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}