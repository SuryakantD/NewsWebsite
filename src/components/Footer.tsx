import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-1.5 rounded-lg">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">Surya TechPulse</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your go-to source for the latest gadgets, technology news, and innovation updates. 
              Aggregating from top tech publications worldwide.
            </p>
          </div>

          {/* Sources */}
          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-300">News Sources</h3>
            <ul className="space-y-1.5 text-sm text-gray-400">
              <li>The Verge</li>
              <li>TechCrunch</li>
              <li>Engadget</li>
              <li>Ars Technica</li>
              <li>Gizmodo</li>
              <li>CNET</li>
              <li>Android Authority</li>
              <li>Polygon</li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-gray-300">About</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>📡 Auto-refreshes every 30 seconds</p>
              <p>🌐 Aggregates from 8+ tech news sources</p>
              <p>📱 Covers: Gadgets, AI, Mobile, Gaming & more</p>
              <p>🆓 Powered by free RSS feeds</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Surya TechPulse. All news content belongs to respective sources.
          </p>
          <p className="text-xs text-gray-500">
            Built with React + Tailwind CSS | News via RSS feeds
          </p>
        </div>
      </div>
    </footer>
  );
}
