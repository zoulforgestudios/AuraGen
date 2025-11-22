import { SourceResults, SearchResult } from './searchSources';

interface UnifiedSummary {
  mainAnswer: string;
  keyPoints: string[];
  sources: string[];
}

export function createUnifiedSummary(
  sourceResults: SourceResults[],
  query: string
): UnifiedSummary | null {
  if (sourceResults.length === 0) {
    return null;
  }

  // Collect all results from all sources
  const allResults: SearchResult[] = [];
  const sourceNames: string[] = [];

  sourceResults.forEach((source) => {
    source.results.forEach((result) => {
      allResults.push(result);
      if (!sourceNames.includes(source.category)) {
        sourceNames.push(source.category);
      }
    });
  });

  if (allResults.length === 0) {
    return null;
  }

  // Extract summaries and combine them
  const summaries = allResults.map((r) => r.summary).filter(Boolean);
  const allKeyPoints: string[] = [];

  allResults.forEach((result) => {
    if (result.keyPoints) {
      result.keyPoints.forEach((point) => {
        // Avoid duplicates
        if (!allKeyPoints.some((existing) => 
          existing.toLowerCase().includes(point.toLowerCase()) || 
          point.toLowerCase().includes(existing.toLowerCase())
        )) {
          allKeyPoints.push(point);
        }
      });
    }
  });

  // Get the primary result (usually the most relevant one)
  const primaryResult = allResults[0];

  // Combine summaries intelligently
  let mainAnswer = '';

  // If we have Wikipedia or a definitive source, use that as primary
  const wikipediaResult = allResults.find((r) => r.sourceType === 'wikipedia');
  const pokemonResult = allResults.find((r) => r.sourceType === 'pokemon');
  const minecraftResult = allResults.find((r) => r.sourceType === 'minecraft');

  if (wikipediaResult) {
    mainAnswer = combineText(wikipediaResult.summary, summaries, 4);
  } else if (pokemonResult) {
    mainAnswer = combineText(pokemonResult.summary, summaries, 4);
  } else if (minecraftResult) {
    mainAnswer = combineText(minecraftResult.summary, summaries, 4);
  } else if (primaryResult) {
    mainAnswer = combineText(primaryResult.summary, summaries, 4);
  }

  // Limit key points to the most relevant ones
  const limitedKeyPoints = allKeyPoints.slice(0, 5);

  return {
    mainAnswer,
    keyPoints: limitedKeyPoints,
    sources: sourceNames,
  };
}

function combineText(
  primaryText: string,
  allTexts: string[],
  maxSentences: number
): string {
  // Split primary text into sentences
  const sentences = primaryText
    .split(/\.\s+/)
    .filter((s) => s.trim().length > 10)
    .map((s) => s.trim() + '.');

  // Take first few sentences from primary source
  let combined = sentences.slice(0, maxSentences).join(' ');

  // If we need more context, add unique information from other sources
  if (sentences.length < 3 && allTexts.length > 1) {
    const otherTexts = allTexts.filter((t) => t !== primaryText);
    for (const text of otherTexts) {
      const otherSentences = text
        .split(/\.\s+/)
        .filter((s) => s.trim().length > 10)
        .map((s) => s.trim() + '.');

      // Add one unique sentence from another source
      const uniqueSentence = otherSentences.find(
        (s) => !combined.toLowerCase().includes(s.toLowerCase().slice(0, 20))
      );

      if (uniqueSentence && combined.split(/\.\s+/).length < maxSentences) {
        combined += ' ' + uniqueSentence;
      }
    }
  }

  // Clean up and limit length
  const finalSentences = combined
    .split(/\.\s+/)
    .filter((s) => s.trim().length > 0)
    .slice(0, maxSentences);

  return finalSentences.join('. ') + (finalSentences.length > 0 ? '.' : '');
}

export function getSourceLinks(sourceResults: SourceResults[]): Array<{
  title: string;
  url: string;
}> {
  const links: Array<{ title: string; url: string }> = [];

  sourceResults.forEach((source) => {
    source.results.forEach((result) => {
      if (!links.some((l) => l.url === result.url)) {
        links.push({
          title: result.title,
          url: result.url,
        });
      }
    });
  });

  return links.slice(0, 3); // Return top 3 most relevant links
}
