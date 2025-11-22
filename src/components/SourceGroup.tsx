import { motion } from 'motion/react';
import { ResultCard } from './ResultCard';
import { SourceResults } from '../lib/searchSources';

interface SourceGroupProps {
  sourceResults: SourceResults;
  index: number;
}

export function SourceGroup({ sourceResults, index }: SourceGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-[2px] w-8 bg-gradient-to-r from-[#00D9FF] to-transparent"></div>
        <h3 className="text-[#00D9FF]">{sourceResults.category}</h3>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#00D9FF]/30 to-transparent"></div>
        <span className="text-xs text-gray-500">
          {sourceResults.results.length} result{sourceResults.results.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {sourceResults.results.map((result, resultIndex) => (
          <ResultCard key={resultIndex} result={result} />
        ))}
      </div>
    </motion.div>
  );
}
