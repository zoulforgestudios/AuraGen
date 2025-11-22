export interface SearchResult {
  title: string;
  summary: string;
  keyPoints?: string[];
  thumbnail?: string;
  url: string;
  sourceType: string;
}

export interface SourceResults {
  category: string;
  results: SearchResult[];
}

// Wikipedia Search
export async function searchWikipedia(query: string): Promise<SearchResult[]> {
  try {
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query
      )}&format=json&origin=*`
    );
    const searchData = await searchResponse.json();

    if (!searchData.query.search.length) return [];

    const topResult = searchData.query.search[0];
    const summaryResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        topResult.title
      )}`
    );
    const summaryData = await summaryResponse.json();

    return [
      {
        title: summaryData.title,
        summary: summaryData.extract,
        thumbnail: summaryData.thumbnail?.source,
        url: summaryData.content_urls.desktop.page,
        sourceType: 'wikipedia',
      },
    ];
  } catch (error) {
    return [];
  }
}

// Reddit Search
export async function searchReddit(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=3`
    );
    const data = await response.json();

    return data.data.children.slice(0, 3).map((post: any) => ({
      title: post.data.title,
      summary: post.data.selftext || 'Discussion thread on Reddit',
      keyPoints: [
        `${post.data.ups} upvotes`,
        `${post.data.num_comments} comments`,
        `r/${post.data.subreddit}`,
      ],
      thumbnail: post.data.thumbnail?.startsWith('http')
        ? post.data.thumbnail
        : undefined,
      url: `https://www.reddit.com${post.data.permalink}`,
      sourceType: 'reddit',
    }));
  } catch (error) {
    return [];
  }
}

// Pokémon Database Search
export async function searchPokemon(query: string): Promise<SearchResult[]> {
  try {
    const pokemonName = query.toLowerCase().replace(/[^a-z0-9]/g, '');
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    
    if (!response.ok) {
      // Try searching by partial match
      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species?limit=1000`
      );
      const speciesData = await speciesResponse.json();
      const match = speciesData.results.find((p: any) =>
        p.name.includes(pokemonName.slice(0, 4))
      );
      
      if (!match) return [];
      
      const pokemonResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${match.name}`
      );
      const data = await pokemonResponse.json();
      return formatPokemonData(data);
    }
    
    const data = await response.json();
    return formatPokemonData(data);
  } catch (error) {
    return [];
  }
}

function formatPokemonData(data: any): SearchResult[] {
  return [
    {
      title: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      summary: `${data.name} is a ${data.types
        .map((t: any) => t.type.name)
        .join('/')} type Pokémon with ${data.stats[0].base_stat} HP.`,
      keyPoints: [
        `Type: ${data.types.map((t: any) => t.type.name).join(', ')}`,
        `Height: ${data.height / 10}m`,
        `Weight: ${data.weight / 10}kg`,
        `Abilities: ${data.abilities.map((a: any) => a.ability.name).join(', ')}`,
      ],
      thumbnail: data.sprites.other['official-artwork'].front_default,
      url: `https://www.pokemon.com/us/pokedex/${data.name}`,
      sourceType: 'pokemon',
    },
  ];
}

// Minecraft Wiki Search
export async function searchMinecraft(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(
      `https://minecraft.fandom.com/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        query
      )}&format=json&origin=*`
    );
    const data = await response.json();

    if (!data.query.search.length) return [];

    const topResult = data.query.search[0];
    return [
      {
        title: topResult.title,
        summary: topResult.snippet.replace(/<[^>]*>/g, ''),
        url: `https://minecraft.fandom.com/wiki/${encodeURIComponent(
          topResult.title
        )}`,
        sourceType: 'minecraft',
      },
    ];
  } catch (error) {
    return [];
  }
}

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!;
const GOOGLE_CX = process.env.NEXT_PUBLIC_GOOGLE_CX!;


export async function searchGoogle(query: string): Promise<SearchResult[]> {
  const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  const data = await response.json();

  // Convert Google API response → your UI format
  return data.items?.map((item: any) => ({
    title: item.title,
    summary: item.snippet,
    keyPoints: [], // Google doesn’t provide bullet points (you can generate using GPT if you want)
    url: item.link,
    sourceType: "google",
  })) || [];
}



// Mock Spotify Search (requires API key)
export async function searchSpotify(query: string): Promise<SearchResult[]> {
  // In production, use Spotify Web API
  return [
    {
      title: `Music search: "${query}"`,
      summary: `To enable Spotify integration, add your Spotify API credentials. This will provide artist info, albums, tracks, and playlists.`,
      keyPoints: [
        'Artist discographies',
        'Album information',
        'Track details and previews',
      ],
      url: `https://open.spotify.com/search/${encodeURIComponent(query)}`,
      sourceType: 'spotify',
    },
  ];
}

// Mock Anime/Crunchyroll Search
export async function searchAnime(query: string): Promise<SearchResult[]> {
  // In production, use Jikan API (MyAnimeList) or AniList API
  return [
    {
      title: `Anime search: "${query}"`,
      summary: `To enable anime database integration, implement Jikan API or AniList GraphQL API. This will provide anime info, episodes, ratings, and reviews.`,
      keyPoints: [
        'Anime series information',
        'Episode guides',
        'Ratings and reviews',
      ],
      url: `https://myanimelist.net/search/all?q=${encodeURIComponent(query)}`,
      sourceType: 'anime',
    },
  ];
}

// Mock News Search (BBC, Times of India, Economic Times)
export async function searchNews(query: string): Promise<SearchResult[]> {
  // In production, use News API or RSS feeds
  return [
    {
      title: `Latest news on "${query}"`,
      summary: `To enable news aggregation, integrate News API or RSS feeds from BBC, Times of India, and Economic Times. This will provide real-time news articles.`,
      keyPoints: [
        'Breaking news updates',
        'Multiple source coverage',
        'Regional and global news',
      ],
      url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
      sourceType: 'news',
    },
  ];
}

// Mock Sports/Cricket Search (ESPN Cricinfo)
export async function searchSports(query: string): Promise<SearchResult[]> {
  // In production, use ESPN API or Cricinfo feeds
  return [
    {
      title: `Sports coverage: "${query}"`,
      summary: `To enable sports integration, implement ESPN Cricinfo API. This will provide live scores, match schedules, player stats, and cricket news.`,
      keyPoints: [
        'Live match scores',
        'Player statistics',
        'Tournament schedules',
      ],
      url: `https://www.espncricinfo.com/search?q=${encodeURIComponent(query)}`,
      sourceType: 'sports',
    },
  ];
}

// Mock Programming Language Wikis
export async function searchProgramming(query: string): Promise<SearchResult[]> {
  // Check if query contains programming keywords
  const progKeywords = [
    'javascript',
    'python',
    'java',
    'react',
    'node',
    'typescript',
    'css',
    'html',
    'sql',
    'api',
    'function',
    'class',
    'variable',
  ];
  
  const isProgrammingQuery = progKeywords.some((keyword) =>
    query.toLowerCase().includes(keyword)
  );

  if (!isProgrammingQuery) return [];

  return [
    {
      title: `Programming documentation: "${query}"`,
      summary: `To enable programming wiki integration, implement MDN Web Docs API, DevDocs, or language-specific documentation APIs. This will provide code examples and API references.`,
      keyPoints: [
        'Code examples and syntax',
        'API documentation',
        'Best practices and guides',
      ],
      url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(
        query
      )}`,
      sourceType: 'programming',
    },
  ];
}

// Mock Translation
export async function searchTranslation(query: string): Promise<SearchResult[]> {
  // Check if query is a translation request
  const translationKeywords = [
    'translate',
    'translation',
    'how do you say',
    'what is',
    'in spanish',
    'in french',
    'in hindi',
    'in chinese',
  ];

  const isTranslationQuery = translationKeywords.some((keyword) =>
    query.toLowerCase().includes(keyword)
  );

  if (!isTranslationQuery) return [];

  return [
    {
      title: `Translation service`,
      summary: `To enable translation, integrate Google Translate API or LibreTranslate. This will provide translations across 100+ languages.`,
      keyPoints: [
        'Multi-language support',
        'Text and phrase translation',
        'Pronunciation guides',
      ],
      url: `https://translate.google.com/?text=${encodeURIComponent(query)}`,
      sourceType: 'translation',
    },
  ];
}

// Master search function
export async function searchAllSources(
  query: string
): Promise<SourceResults[]> {
  const [
    googleResults,
    spotifyResults,
    pokemonResults,
    animeResults,
    minecraftResults,
    redditResults,
    newsResults,
    sportsResults,
    programmingResults,
    translationResults,
    wikipediaResults,
  ] = await Promise.all([
    searchGoogle(query),
    searchSpotify(query),
    searchPokemon(query),
    searchAnime(query),
    searchMinecraft(query),
    searchReddit(query),
    searchNews(query),
    searchSports(query),
    searchProgramming(query),
    searchTranslation(query),
    searchWikipedia(query),
  ]);

  const allResults: SourceResults[] = [
    { category: 'Google Results', results: googleResults },
    { category: 'Spotify / Music Database', results: spotifyResults },
    { category: 'Pokémon Database', results: pokemonResults },
    { category: 'Anime / Crunchyroll Wiki', results: animeResults },
    { category: 'Minecraft Wiki', results: minecraftResults },
    { category: 'Reddit Discussions', results: redditResults },
    { category: 'News (BBC / Times of India / Economic Times)', results: newsResults },
    { category: 'Sports & Cricket (ESPN Cricinfo)', results: sportsResults },
    { category: 'Programming Language Wikis', results: programmingResults },
    { category: 'Translations', results: translationResults },
    { category: 'Wikipedia Summary', results: wikipediaResults },
  ];

  // Filter out empty results
  return allResults.filter((source) => source.results.length > 0);
}
