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

export async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json&no_redirect=1&no_html=1`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.Heading && !data.Abstract) return [];

    return [
      {
        title: data.Heading || query,
        summary: data.Abstract || "No summary available.",
        keyPoints: data.RelatedTopics?.slice(0, 3).map((t: any) => t.Text) || [],
        thumbnail: data.Image || undefined,
        url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        sourceType: "duckduckgo",
      },
    ];
  } catch {
    return [];
  }
}


export async function searchYouTube(query: string): Promise<SearchResult[]> {
  try {
    const url = `https://invidious.snopyta.org/api/v1/search?q=${encodeURIComponent(
      query
    )}&type=video`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();

    return data.slice(0, 3).map((video: any) => ({
      title: video.title,
      summary: video.description || "YouTube video",
      thumbnail: video.videoThumbnails?.[0]?.url,
      keyPoints: [
        `By: ${video.author}`,
        `Views: ${video.viewCount}`,
        `Duration: ${video.lengthSeconds}s`,
      ],
      url: `https://youtube.com/watch?v=${video.videoId}`,
      sourceType: "youtube",
    }));
  } catch {
    return [];
  }
}



export async function searchAllSources(query: string): Promise<SourceResults[]> {
  const [
    pokemonResults,
    minecraftResults,
    redditResults,
    wikipediaResults,
    duckduckgoResults,
    youtubeResults,
  ] = await Promise.all([
    searchPokemon(query),
    searchMinecraft(query),
    searchReddit(query),
    searchWikipedia(query),
    searchDuckDuckGo(query),
    searchYouTube(query),
  ]);

  const allResults: SourceResults[] = [
    { category: "Pokémon Database", results: pokemonResults },
    { category: "Minecraft Wiki", results: minecraftResults },
    { category: "Reddit Discussions", results: redditResults },
    { category: "Wikipedia Summary", results: wikipediaResults },
    { category: "DuckDuckGo Results", results: duckduckgoResults },
    { category: "YouTube Videos", results: youtubeResults },
  ];

  return allResults.filter((source) => source.results.length > 0);
}

