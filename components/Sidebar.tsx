import React from 'react';
import { Post } from '../types';
import AdBanner from './AdBanner';

interface SidebarProps {
  trendingPosts: Post[];
  onPostClick: (post: Post) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ trendingPosts, onPostClick }) => {
  return (
    <aside className="space-y-8 sticky top-28">
      
      {/* Ad Slot: Sidebar Top (High Value) */}
      <AdBanner variant="rectangle" />

      {/* About Widget */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
        <h4 className="font-bold text-white mb-4 text-lg border-b border-white/10 pb-2">درباره ما</h4>
        <p className="text-gray-400 text-sm leading-relaxed">
          ما یک پلتفرم هوشمند هستیم که با استفاده از جدیدترین تکنولوژی‌های هوش مصنوعی، اخبار و مقالات روز را برای شما گردآوری می‌کنیم.
        </p>
      </div>

      {/* Trending Widget */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
        <h4 className="font-bold text-white mb-4 text-lg border-b border-white/10 pb-2">محبوب‌ترین‌ها</h4>
        <div className="space-y-4">
          {trendingPosts.slice(0, 4).map((post, idx) => (
            <div 
              key={post.id} 
              className="flex items-start gap-3 cursor-pointer group"
              onClick={() => onPostClick(post)}
            >
              <span className="text-4xl font-black text-white/10 group-hover:text-indigo-500/50 transition -ml-1">
                {idx + 1}
              </span>
              <div>
                <h5 className="text-sm font-bold text-gray-300 group-hover:text-indigo-400 transition line-clamp-2">
                  {post.title}
                </h5>
                <span className="text-xs text-gray-500 mt-1 block">{post.views} بازدید</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter (Visual only) */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-2xl shadow-lg text-white text-center border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm z-0"></div>
        <div className="relative z-10">
          <h4 className="font-bold text-lg mb-2">خبرنامه</h4>
          <p className="text-indigo-200 text-sm mb-4">برای دریافت آخرین اخبار عضو شوید</p>
          <div className="space-y-2">
            <input type="email" placeholder="ایمیل خود را وارد کنید" className="w-full px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition placeholder-gray-500" />
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 transition py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/30">
              عضویت
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;