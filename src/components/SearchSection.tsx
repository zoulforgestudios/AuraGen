import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchAllSources, SourceResults } from '../lib/searchSources';
import { createUnifiedSummary, getSourceLinks } from '../lib/summarizer';
import { UnifiedSummary } from './UnifiedSummary';

interface SummaryData {
  mainAnswer: string;
  keyPoints: string[];
  sourceLinks: Array<{ title: string; url: string }>;
}

export function SearchSection() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSummary(null);

    try {
      const searchResults = await searchAllSources(query);
      
      const unifiedSummary = createUnifiedSummary(searchResults, query);
      
      if (!unifiedSummary) {
        setError('Not enough information available to summarize this topic.');
      } else {
        const sourceLinks = getSourceLinks(searchResults);
        setSummary({
          mainAnswer: unifiedSummary.mainAnswer,
          keyPoints: unifiedSummary.keyPoints,
          sourceLinks,
        });
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything…"
              className="w-full px-6 py-4 bg-[#1A1D29] border border-[#00D9FF]/20 rounded-full 
                       text-white placeholder-gray-500 focus:outline-none focus:border-[#00D9FF] 
                       focus:shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-8 py-4 bg-gradient-to-r from-[#00D9FF] to-[#0099FF] rounded-full 
                     hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
                     animate-pulse-glow"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Search className="size-5" />
            )}
            Search
          </button>
        </div>
      </form>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-[#00D9FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#00D9FF] mb-2">Exploring knowledge sources...</p>
              <p className="text-gray-500 text-sm">
                Searching across multiple platforms to create your summary
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#1A1D29] border border-[#00D9FF]/20 rounded-2xl p-8 text-center"
          >
            <p className="text-gray-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Summary Display */}
      <AnimatePresence>
        {summary && (
          <UnifiedSummary
            mainAnswer={summary.mainAnswer}
            keyPoints={summary.keyPoints}
            sourceLinks={summary.sourceLinks}
          />
        )}
      </AnimatePresence>
    </div>
  );
}