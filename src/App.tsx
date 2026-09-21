import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BreakingTicker from './components/BreakingTicker';
import HeroSection from './components/HeroSection';
import NewsGrid from './components/NewsGrid';
import CategorySection from './components/CategorySection';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { fetchAllFeeds, type NewsArticle } from './utils/feedParser';

function App() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [activeCategory, setActiveCategory] = useState('all');

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllFeeds();
      setArticles(data);
      setLastUpdated(new Date());
      setCountdown(30);
    } catch (err) {
      setError('Failed to fetch news. Retrying in 30 seconds...');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadNews();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loadNews]);

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());

  const categories = ['all', 'gadgets', 'ai', 'software', 'reviews', 'mobile', 'gaming'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        countdown={countdown}
        lastUpdated={lastUpdated}
        onRefresh={loadNews}
      />
      
      <BreakingTicker articles={articles.slice(0, 8)} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading && articles.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading latest tech news...</p>
            </div>
          </div>
        ) : (
          <>
            {activeCategory === 'all' && (
              <>
                <HeroSection articles={articles.slice(0, 5)} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                  <div className="lg:col-span-2">
                    <NewsGrid articles={articles.slice(5, 17)} title="Latest News" />
                  </div>
                  <Sidebar articles={articles.slice(0, 10)} />
                </div>

                <CategorySection
                  articles={articles.filter((a) => a.category === 'Gadgets')}
                  title="🔌 Gadgets & Devices"
                  category="gadgets"
                />

                <CategorySection
                  articles={articles.filter((a) => a.category === 'AI')}
                  title="🤖 AI & Innovation"
                  category="ai"
                />

                <CategorySection
                  articles={articles.filter((a) => a.category === 'Mobile')}
                  title="📱 Mobile & Apps"
                  category="mobile"
                />
              </>
            )}

            {activeCategory !== 'all' && (
              <NewsGrid
                articles={filteredArticles}
                title={`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} News`}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
