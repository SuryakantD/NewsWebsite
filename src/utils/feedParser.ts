export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  source: string;
  category: string;
  publishedAt: Date;
  author?: string;
}

// Free RSS feed sources for tech/gadget news
const RSS_FEEDS = [
  {
    url: 'https://www.theverge.com/rss/index.xml',
    name: 'The Verge',
    category: 'Gadgets',
  },
  {
    url: 'https://techcrunch.com/feed/',
    name: 'TechCrunch',
    category: 'AI',
  },
  {
    url: 'https://www.engadget.com/rss.xml',
    name: 'Engadget',
    category: 'Gadgets',
  },
  {
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    name: 'Ars Technica',
    category: 'Software',
  },
  {
    url: 'https://www.gizmodo.com/rss',
    name: 'Gizmodo',
    category: 'Gadgets',
  },
  {
    url: 'https://www.cnet.com/rss/news/',
    name: 'CNET',
    category: 'Reviews',
  },
  {
    url: 'https://www.androidauthority.com/feed/',
    name: 'Android Authority',
    category: 'Mobile',
  },
  {
    url: 'https://www.polygon.com/rss/index.xml',
    name: 'Polygon',
    category: 'Gaming',
  },
];

// Use rss2json.com free API (no key needed for basic usage)
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

// CORS proxies as fallback
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

async function fetchFeed(feedUrl: string, sourceName: string, category: string): Promise<NewsArticle[]> {
  // Try rss2json first
  try {
    const response = await fetch(
      `${RSS2JSON_API}?rss_url=${encodeURIComponent(feedUrl)}&count=10`
    );
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.status === 'ok' && data.items && data.items.length > 0) {
        return data.items.map((item: any, index: number) => ({
          id: `${sourceName}-${index}-${Date.now()}`,
          title: cleanText(item.title || ''),
          description: cleanText(item.description || item.content || '').substring(0, 200),
          link: item.link || '#',
          image: extractImage(item),
          source: sourceName,
          category: categorizeArticle(item.title || '', category),
          publishedAt: new Date(item.pubDate || Date.now()),
          author: item.author || sourceName,
        }));
      }
    }
  } catch (error) {
    console.warn(`rss2json failed for ${sourceName}, trying CORS proxy...`);
  }

  // Fallback: Try CORS proxy + manual XML parsing
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(`${proxy}${encodeURIComponent(feedUrl)}`);
      if (response.ok) {
        const text = await response.text();
        const articles = parseRSSXml(text, sourceName, category);
        if (articles.length > 0) return articles;
      }
    } catch (error) {
      console.warn(`CORS proxy failed for ${sourceName}:`, error);
    }
  }

  return [];
}

function parseRSSXml(xml: string, sourceName: string, category: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const items = doc.querySelectorAll('item');
    
    items.forEach((item, index) => {
      if (index >= 10) return;
      
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '#';
      const description = item.querySelector('description')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const author = item.querySelector('author')?.textContent || 
                     item.querySelector('dc\\:creator')?.textContent || '';
      
      // Extract image from various RSS elements
      let image = '';
      const mediaContent = item.querySelector('media\\:content, content');
      const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail');
      const enclosure = item.querySelector('enclosure');
      
      if (mediaContent?.getAttribute('url')) {
        image = mediaContent.getAttribute('url') || '';
      } else if (mediaThumbnail?.getAttribute('url')) {
        image = mediaThumbnail.getAttribute('url') || '';
      } else if (enclosure?.getAttribute('url') && enclosure.getAttribute('type')?.startsWith('image')) {
        image = enclosure.getAttribute('url') || '';
      } else {
        // Try to extract from description/content
        const content = item.querySelector('content\\:encoded')?.textContent || description;
        const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) image = imgMatch[1];
      }
      
      if (!image) {
        image = `https://picsum.photos/seed/${encodeURIComponent(title || sourceName + index)}/800/450`;
      }

      articles.push({
        id: `${sourceName}-${index}-${Date.now()}`,
        title: cleanText(title),
        description: cleanText(description).substring(0, 200),
        link,
        image,
        source: sourceName,
        category: categorizeArticle(title, category),
        publishedAt: new Date(pubDate || Date.now()),
        author: author || sourceName,
      });
    });
  } catch (error) {
    console.warn(`XML parsing failed for ${sourceName}:`, error);
  }
  
  return articles;
}

function extractImage(item: any): string {
  if (item.thumbnail) return item.thumbnail;
  if (item.enclosure?.link) return item.enclosure.link;
  
  const content = item.content || item.description || '';
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
  if (imgMatch) return imgMatch[1];
  
  if (item['media:content']?.$?.url) return item['media:content'].$.url;
  
  return `https://picsum.photos/seed/${encodeURIComponent(item.title || 'tech')}/800/450`;
}

function categorizeArticle(title: string, defaultCategory: string): string {
  const lower = title.toLowerCase();
  
  if (lower.match(/iphone|android|samsung|pixel|phone|smartphone|mobile|oneplus|xiaomi|oppo|huawei/)) return 'Mobile';
  if (lower.match(/\bai\b|artificial intelligence|machine learning|gpt|chatbot|neural|openai|claude|gemini|copilot|llm/)) return 'AI';
  if (lower.match(/review|unbox|hands.on|first.look|best.*buy|top.*pick/)) return 'Reviews';
  if (lower.match(/game|xbox|playstation|nintendo|steam|gaming|esports|fortnite|minecraft/)) return 'Gaming';
  if (lower.match(/laptop|tablet|watch|headphone|speaker|camera|gadget|device|wearable|tv|display|monitor|keyboard|mouse|drone|robot/)) return 'Gadgets';
  if (lower.match(/software|app|update|windows|mac|linux|program|chrome|firefox|browser|security|cyber|hack|vulnerability/)) return 'Software';
  
  return defaultCategory;
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fallback sample data in case all feeds fail
function getFallbackData(): NewsArticle[] {
  const now = new Date();
  return [
    {
      id: 'fallback-1',
      title: 'Apple iPhone 18 Pro Max Review: The Best Smartphone of 2026',
      description: 'Apple\'s latest flagship brings revolutionary camera improvements, A20 Bionic chip, and all-day battery life. We put it through its paces.',
      link: 'https://www.theverge.com',
      image: 'https://picsum.photos/seed/iphone18pro/800/450',
      source: 'The Verge',
      category: 'Mobile',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 15),
    },
    {
      id: 'fallback-2',
      title: 'OpenAI Announces GPT-5 with Unprecedented Reasoning Capabilities',
      description: 'The new model demonstrates significant improvements in logical reasoning, coding, and creative tasks, setting new benchmarks across the board.',
      link: 'https://techcrunch.com',
      image: 'https://picsum.photos/seed/gpt5ai/800/450',
      source: 'TechCrunch',
      category: 'AI',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 30),
    },
    {
      id: 'fallback-3',
      title: 'Samsung Galaxy S26 Ultra Leaked: Titanium Frame and 200MP Camera',
      description: 'New leaks reveal Samsung\'s next flagship will feature a titanium body, improved 200MP sensor, and the Snapdragon 8 Gen 5 processor.',
      link: 'https://www.engadget.com',
      image: 'https://picsum.photos/seed/galaxys26/800/450',
      source: 'Engadget',
      category: 'Gadgets',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 45),
    },
    {
      id: 'fallback-4',
      title: 'Meta Quest 4 Announced with Mixed Reality Breakthrough',
      description: 'Meta\'s latest VR headset features full-color passthrough, eye tracking, and a new lightweight design starting at $399.',
      link: 'https://www.theverge.com',
      image: 'https://picsum.photos/seed/metaquest4/800/450',
      source: 'The Verge',
      category: 'Gadgets',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60),
    },
    {
      id: 'fallback-5',
      title: 'Windows 12 AI Features: Everything You Need to Know',
      description: 'Microsoft\'s next-gen OS integrates deep AI capabilities directly into the desktop experience with Copilot+ features.',
      link: 'https://www.cnet.com',
      image: 'https://picsum.photos/seed/windows12/800/450',
      source: 'CNET',
      category: 'Software',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 90),
    },
    {
      id: 'fallback-6',
      title: 'Google Pixel 10 Pro: AI-Powered Photography Redefined',
      description: 'Google\'s latest Pixel leverages advanced AI processing to deliver stunning photos in any lighting condition.',
      link: 'https://www.androidauthority.com',
      image: 'https://picsum.photos/seed/pixel10pro/800/450',
      source: 'Android Authority',
      category: 'Mobile',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 120),
    },
    {
      id: 'fallback-7',
      title: 'PlayStation 6 Specs Revealed: 16K Gaming Coming Soon',
      description: 'Sony confirms next-gen console specs including custom AMD chip, ray tracing improvements, and backward compatibility.',
      link: 'https://www.polygon.com',
      image: 'https://picsum.photos/seed/ps6gaming/800/450',
      source: 'Polygon',
      category: 'Gaming',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 150),
    },
    {
      id: 'fallback-8',
      title: 'DJI Mini 5 Pro: The Ultimate Drone for Content Creators',
      description: 'Under 249g with 8K video, obstacle avoidance in all directions, and 45-minute flight time.',
      link: 'https://www.gizmodo.com',
      image: 'https://picsum.photos/seed/djimini5/800/450',
      source: 'Gizmodo',
      category: 'Gadgets',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 180),
    },
    {
      id: 'fallback-9',
      title: 'Tesla Robotaxi Service Launches in 5 More Cities',
      description: 'Tesla expands its autonomous ride-hailing service with improved safety features and lower pricing.',
      link: 'https://techcrunch.com',
      image: 'https://picsum.photos/seed/teslarobotaxi/800/450',
      source: 'TechCrunch',
      category: 'AI',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 200),
    },
    {
      id: 'fallback-10',
      title: 'Best Wireless Earbuds 2026: Our Top Picks Tested',
      description: 'We tested 30+ wireless earbuds to find the best for every budget. From $30 budget picks to premium audiophile options.',
      link: 'https://www.cnet.com',
      image: 'https://picsum.photos/seed/earbuds2026/800/450',
      source: 'CNET',
      category: 'Reviews',
      publishedAt: new Date(now.getTime() - 1000 * 60 * 240),
    },
  ];
}

export async function fetchAllFeeds(): Promise<NewsArticle[]> {
  const promises = RSS_FEEDS.map((feed) =>
    fetchFeed(feed.url, feed.name, feed.category)
  );

  const results = await Promise.allSettled(promises);
  
  const allArticles: NewsArticle[] = [];
  let successCount = 0;
  
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      allArticles.push(...result.value);
      successCount++;
    }
  });

  // If no feeds succeeded, return fallback data
  if (successCount === 0) {
    console.warn('All feeds failed, using fallback data');
    return getFallbackData();
  }

  // Sort by date (newest first) and remove duplicates
  const uniqueArticles = allArticles
    .filter((article, index, self) =>
      index === self.findIndex((a) => a.title === article.title)
    )
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return uniqueArticles;
}
