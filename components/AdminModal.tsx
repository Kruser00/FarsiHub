import React, { useState, useEffect, useRef } from 'react';
import { LogEntry, Stats, Post } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  stats: Stats;
  isGenerating: boolean;
  onToggleGeneration: () => void;
  nextGenerationTime: number;
  posts: Post[];
  onDeletePost: (id: string) => void;
  onImportPosts: (posts: Post[]) => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ 
  isOpen, 
  onClose, 
  logs, 
  stats, 
  isGenerating, 
  onToggleGeneration,
  nextGenerationTime,
  posts,
  onDeletePost,
  onImportPosts
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts'>('dashboard');
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll logs
  useEffect(() => {
    if (logsEndRef.current && activeTab === 'dashboard') {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  const calculateCountdown = () => {
    const diff = Math.max(0, Math.ceil((nextGenerationTime - Date.now()) / 1000));
    return diff;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, [nextGenerationTime]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated security credential
    if (password === 'Kruser1200') {
      setIsAuthenticated(true);
    } else {
      alert('رمز عبور اشتباه است');
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(posts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `farsihub-backup-${new Date().toISOString().slice(0,10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleGenerateSitemap = () => {
    const baseUrl = window.location.origin;
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const xmlFooter = '</urlset>';
    
    const urls = posts.map(post => `
  <url>
    <loc>${baseUrl}/?post=${post.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    const sitemapContent = `${xmlHeader}${urls}\n${xmlFooter}`;
    const blob = new Blob([sitemapContent], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    link.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = e => {
        try {
          if (e.target?.result) {
            const parsedData = JSON.parse(e.target.result as string);
            if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].title) {
               if(window.confirm(`آیا مطمئن هستید؟ این کار ${parsedData.length} مقاله را جایگزین مقالات فعلی می‌کند.`)) {
                 onImportPosts(parsedData as Post[]);
                 alert('بازگردانی اطلاعات با موفقیت انجام شد.');
               }
            } else {
              alert('فرمت فایل نامعتبر است.');
            }
          }
        } catch (error) {
          alert('خطا در خواندن فایل JSON.');
        }
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/10">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <h2 className="text-xl font-bold text-white tracking-wide">پنل مدیریت فارسی هاب</h2>
          </div>
          
          {isAuthenticated && (
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                مانیتورینگ
              </button>
              <button 
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'posts' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                مدیریت محتوا
              </button>
            </div>
          )}

          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
              <h3 className="text-xl font-bold text-center text-gray-200">احراز هویت مدیر</h3>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور" 
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-600"
              />
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
                ورود به پنل
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col relative">
            
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                {/* Controls & Stats */}
                <div className="w-full md:w-1/3 p-6 border-l border-white/10 bg-black/20 overflow-y-auto">
                  <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">کنترل سیستم</h3>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-sm mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">وضعیت ربات</span>
                        <div className={`w-3 h-3 rounded-full ${isGenerating ? 'bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`}></div>
                      </div>
                      <button 
                        onClick={onToggleGeneration}
                        className={`w-full py-2.5 rounded-lg text-sm font-bold transition ${isGenerating ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'}`}
                      >
                        {isGenerating ? 'توقف تولید محتوا' : 'شروع تولید خودکار'}
                      </button>
                      {isGenerating && (
                        <p className="text-xs text-center text-gray-500 mt-2 font-mono">
                          زمان تا پست بعدی: {countdown} ثانیه
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-xs text-gray-500 block mb-1">درآمد کل (تخمینی)</span>
                        <span className="text-2xl font-bold text-green-400 font-mono">${stats.totalRevenue.toFixed(2)}</span>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-xs text-gray-500 block mb-1">تعداد مقالات</span>
                        <span className="text-2xl font-bold text-white font-mono">{stats.postsGenerated}</span>
                      </div>
                    </div>

                    {/* Data Backup Section */}
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">SEO & پایگاه داده</h3>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                       <button 
                         onClick={handleGenerateSitemap}
                         className="col-span-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                       >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                         دانلود Sitemap.xml
                       </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <button 
                         onClick={handleExportData}
                         className="bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                       >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                         پشتیبانی
                       </button>
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                       >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                         بازیابی
                       </button>
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         className="hidden" 
                         accept="application/json" 
                         onChange={handleImportData}
                       />
                    </div>
                  </div>
                </div>

                {/* Console Logs */}
                <div className="w-full md:w-2/3 p-6 flex flex-col bg-black/90 text-green-400 font-mono text-xs md:text-sm border-r border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-gray-500 uppercase font-bold text-xs tracking-wider">Live System Logs</h3>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1 p-3 border border-gray-800 rounded bg-black/50 shadow-inner">
                    {logs.length === 0 && <span className="text-gray-700 italic">... System ready. Waiting for logs ...</span>}
                    {logs.map((log) => (
                      <div key={log.id} className="flex gap-2">
                        <span className="text-gray-600 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className={`${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-300 font-bold' : 'text-green-400'}`}>
                          {log.type === 'info' && '> '}
                          {log.message}
                        </span>
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTENT MANAGER */}
            {activeTab === 'posts' && (
              <div className="flex-1 p-6 overflow-y-auto bg-black/20">
                <div className="max-w-4xl mx-auto">
                   <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <span>مدیریت مقالات</span>
                    <span className="text-xs bg-indigo-600 px-2 py-1 rounded-full">{posts.length} مقاله</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-indigo-500/30 transition group">
                        <img src={post.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-800" />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded text-[10px]">{post.category}</span>
                            <span className="text-xs text-gray-500">{post.date}</span>
                          </div>
                          <h4 className="text-white font-medium truncate">{post.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">نویسنده: {post.author.name}</span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-400">{post.views} بازدید</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => onDeletePost(post.id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          title="حذف مقاله"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    {posts.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        هیچ مقاله‌ای یافت نشد.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModal;