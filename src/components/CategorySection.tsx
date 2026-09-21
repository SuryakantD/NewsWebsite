import { type NewsArticle } from '../utils/feedParser';
import { ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  articles: NewsArticle[];
  title: string;
  category: string;
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

export default function CategorySection({ articles, title }: CategorySectionProps) {
  if (articles.length === 0) return null;

  const displayArticles = articles.slice(0, 4);

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {articles.length} stories
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayArticles.map((article, index) => (
          <a
            key={article.id}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${
              index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
            }`}
          >
            <div className={`${index === 0 ? 'aspect-[16/10] sm:aspect-auto sm:h-full' : 'aspect-[4/3]'} overflow-hidden`}>
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(article.title)}/400/300`;
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className={`font-bold leading-tight ${index === 0 ? 'text-lg' : 'text-sm'} line-clamp-2 group-hover:text-blue-300 transition-colors`}>
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-white/60 text-xs">
                <span>{article.source}</span>
                <span>•</span>
                <span>{timeAgo(article.publishedAt)}</span>
                <ArrowRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
