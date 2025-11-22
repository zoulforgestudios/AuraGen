import { ExternalLink } from 'lucide-react';
import { SearchResult } from '../lib/searchSources';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="bg-[#1A1D29] border border-[#00D9FF]/20 rounded-xl p-6 hover:border-[#00D9FF]/50 hover:shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all duration-300">
      <div className="flex gap-4">
        {result.thumbnail && (
          <div className="flex-shrink-0">
            <ImageWithFallback
              src={result.thumbnail}
              alt={result.title}
              className="w-24 h-24 object-cover rounded-lg border border-[#00D9FF]/20"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="mb-2 text-white truncate">{result.title}</h4>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {result.summary}
          </p>
          
          {result.keyPoints && result.keyPoints.length > 0 && (
            <ul className="mb-3 space-y-1">
              {result.keyPoints.slice(0, 3).map((point, index) => (
                <li key={index} className="text-xs text-[#00D9FF] flex items-start">
                  <span className="mr-2">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
          
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-[#00D9FF] hover:underline"
          >
            View Source <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
