import { motion } from 'motion/react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface UnifiedSummaryProps {
  mainAnswer: string;
  keyPoints: string[];
  sourceLinks: Array<{ title: string; url: string }>;
}

export function UnifiedSummary({
  mainAnswer,
  keyPoints,
  sourceLinks,
}: UnifiedSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#1A1D29] to-[#0C0E14] border border-[#00D9FF]/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,217,255,0.2)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#00D9FF]/10 rounded-xl flex items-center justify-center">
          <Sparkles className="size-5 text-[#00D9FF]" />
        </div>
        <div>
          <h3 className="text-white">AuraGen Summary</h3>
          <p className="text-xs text-gray-500">
            Information gathered from multiple knowledge sources
          </p>
        </div>
      </div>

      {/* Main Answer */}
      <div className="mb-6">
        <p className="text-gray-300 leading-relaxed">{mainAnswer}</p>
      </div>

      {/* Key Points */}
      {keyPoints.length > 0 && (
        <div className="mb-6">
          <div className="space-y-2">
            {keyPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-[#00D9FF] rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-400">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source Links */}
      {sourceLinks.length > 0 && (
        <div className="pt-6 border-t border-[#00D9FF]/10">
          <p className="text-xs text-gray-500 mb-3">Learn more:</p>
          <div className="flex flex-wrap gap-3">
            {sourceLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#00D9FF]/10 border border-[#00D9FF]/30 rounded-full text-[#00D9FF] text-sm hover:bg-[#00D9FF]/20 transition-all"
              >
                {link.title}
                <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
