import { type NewsArticle } from '../utils/feedParser';
import { Clock, ArrowRight } from 'lucide-react';

interface NewsGridProps {
  articles: NewsArticle[];
  title: string;
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

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Gadgets': 'bg-emerald-100 text-emerald-700',
    'AI': 'bg-purple-100 text-purple-700',
    'Mobile': 'bg-blue-100 text-blue-700',
    'Software': 'bg-orange-100 text-orange-700',
    'Reviews': 'bg-pink-100 text-pink-700',
    'Gaming': 'bg-red-100 text-red-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
}

export default function NewsGrid({ articles, title }: NewsGridProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <p className="text-gray-500">No articles available in this category yet.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
          {title}
        </h2>
        <span className="text-sm text-gray-500">{articles.length} articles</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(article.title)}/400/225`;
                }}
              />
              <div className="absolute top-2 left-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                {article.title}
              </h3>
              <p className="text-gray-500 text-xs line-clamp-2 flex-1">{article.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="font-medium text-gray-600">{article.source}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Clock size={10} />
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
