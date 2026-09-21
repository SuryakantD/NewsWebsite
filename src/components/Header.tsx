import { RefreshCw, Clock, Zap } from 'lucide-react';

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  categories: string[];
  countdown: number;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export default function Header({
  activeCategory,
  setActiveCategory,
  categories,
  countdown,
  lastUpdated,
  onRefresh,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-yellow-300">
              <Zap size={14} className="animate-pulse" />
              Auto-refresh in {countdown}s
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 bg-blue-700/50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">LIVE</span>
            </div>
            <button
              onClick={onRefresh}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
            >
              <RefreshCw size={14} className={countdown <= 5 ? 'animate-spin' : ''} />
              <span className="text-xs">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
              <Zap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
                TechPulse
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5">Gadgets & Technology</p>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tech news..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat === 'all' ? '🏠 Home' : 
                 cat === 'gadgets' ? '🔌 Gadgets' :
                 cat === 'ai' ? '🤖 AI' :
                 cat === 'software' ? '💻 Software' :
                 cat === 'reviews' ? '⭐ Reviews' :
                 cat === 'mobile' ? '📱 Mobile' :
                 cat === 'gaming' ? '🎮 Gaming' :
                 cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
