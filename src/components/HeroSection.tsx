import { type NewsArticle } from '../utils/feedParser';
import { Clock, ExternalLink } from 'lucide-react';

interface HeroSectionProps {
  articles: NewsArticle[];
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function HeroSection({ articles }: HeroSectionProps) {
  if (articles.length === 0) return null;

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 5);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Main hero article */}
      <a
        href={mainArticle.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 lg:row-span-2"
      >
        <div className="aspect-[16/10] lg:aspect-auto lg:h-full">
          <img
            src={mainArticle.image}
            alt={mainArticle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(mainArticle.title)}/800/500`;
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {mainArticle.category}
            </span>
            <span className="text-white/80 text-xs flex items-center gap-1">
              <Clock size={12} />
              {timeAgo(mainArticle.publishedAt)}
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold leading-tight mb-2 group-hover:text-blue-300 transition-colors">
            {mainArticle.title}
          </h2>
          <p className="text-white/80 text-sm line-clamp-2">{mainArticle.description}</p>
          <div className="flex items-center gap-2 mt-3 text-white/60 text-xs">
            <span>{mainArticle.source}</span>
            <ExternalLink size={12} />
          </div>
        </div>
      </a>

      {/* Side articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sideArticles.map((article) => (
          <a
            key={article.id}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-[16/10]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(article.title)}/400/250`;
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <span className="bg-blue-600/90 text-white text-xs font-medium px-2 py-0.5 rounded">
                {article.category}
              </span>
              <h3 className="text-sm font-bold mt-1.5 leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-white/60 text-xs">
                <span>{article.source}</span>
                <span>•</span>
                <span>{timeAgo(article.publishedAt)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
