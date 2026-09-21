import { type NewsArticle } from '../utils/feedParser';

interface BreakingTickerProps {
  articles: NewsArticle[];
}

export default function BreakingTicker({ articles }: BreakingTickerProps) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-red-600 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        <div className="flex-shrink-0 bg-white text-red-600 px-3 py-2 font-bold text-sm flex items-center gap-1 z-10">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          BREAKING
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap py-2">
            {articles.map((article, index) => (
              <span key={article.id} className="inline-block mx-8 text-sm">
                <span className="font-semibold">{article.source}:</span>{' '}
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {article.title}
                </a>
                {index < articles.length - 1 && <span className="ml-8 text-red-300">•</span>}
              </span>
            ))}
            {articles.map((article, index) => (
              <span key={`dup-${article.id}`} className="inline-block mx-8 text-sm">
                <span className="font-semibold">{article.source}:</span>{' '}
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {article.title}
                </a>
                {index < articles.length - 1 && <span className="ml-8 text-red-300">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
