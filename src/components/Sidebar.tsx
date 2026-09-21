import { type NewsArticle } from '../utils/feedParser';
import { TrendingUp, Clock, ExternalLink } from 'lucide-react';

interface SidebarProps {
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

export default function Sidebar({ articles }: SidebarProps) {
  const topStories = articles.slice(0, 5);
  const latestStories = articles.slice(5, 10);

  // Get unique sources
  const sources = [...new Set(articles.map((a) => a.source))].slice(0, 6);

  return (
    <aside className="space-y-6">
      {/* Most Popular */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
          <h3 className="text-white font-bold flex items-center gap-2">
            <TrendingUp size={18} />
            Most Popular
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {topStories.map((article, index) => (
            <a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors group"
            >
              <span className="text-2xl font-bold text-blue-200 leading-none">{String(index + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>{article.source}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Clock size={10} />
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Latest Updates */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Latest Updates
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {latestStories.map((article) => (
            <a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 hover:bg-gray-50 transition-colors group"
            >
              <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                <span className="font-medium">{article.source}</span>
                <span>•</span>
                <span>{timeAgo(article.publishedAt)}</span>
                <ExternalLink size={10} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-3 text-sm">📡 News Sources</h3>
        <div className="flex flex-wrap gap-2">
          {sources.map((source) => (
            <span
              key={source}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {source}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Aggregating from {sources.length}+ trusted tech news sources
        </p>
      </div>

      {/* Refresh Info */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <h3 className="font-bold text-gray-900 text-sm mb-1">🔄 Auto-Refresh Active</h3>
        <p className="text-xs text-gray-600">
          This page refreshes every 30 seconds to bring you the latest tech news from around the web.
        </p>
      </div>
    </aside>
  );
}
