import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import PostGrid from './components/PostGrid';
import Sidebar from './components/Sidebar';
import AdBanner from './components/AdBanner';
import AdminModal from './components/AdminModal';
import ArticleModal from './components/ArticleModal';
import { Post, LogEntry, Stats, Category } from './types';
import { CATEGORY_WEIGHTS, AUTHORS, SEED_POSTS } from './constants';
import { getTrendingTopic, generateBlogPostContent, generatePostImage } from './services/geminiService';

const STORAGE_KEY = 'fh_posts_v1';
const STATS_KEY = 'fh_stats_v1';

function App() {
  // --- State ---
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats>({ totalViews: 1250, totalRevenue: 12.50, postsGenerated: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // UI State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [nextGenTime, setNextGenTime] = useState(0);

  // --- Persistence & Initialization ---
  useEffect(() => {
    const initializeData = async () => {
      let loadedPosts: Post[] = [];

      // 1. Try to fetch the "Production Database" (posts.json)
      try {
        const response = await fetch('./posts.json');
        if (response.ok) {
          const dbPosts = await response.json();
          if (Array.isArray(dbPosts) && dbPosts.length > 0) {
            loadedPosts = dbPosts;
            addLog('Loaded posts from Production Database (posts.json)', 'success');
          }
        }
      } catch (err) {
        console.log('Static DB not found, falling back to local storage');
      }

      // 2. Fallback to LocalStorage (Development/Manual Mode)
      if (loadedPosts.length === 0) {
        const savedPosts = localStorage.getItem(STORAGE_KEY);
        if (savedPosts) {
          try {
            const parsed = JSON.parse(savedPosts);
            if (parsed.length > 0 && typeof parsed[0].author === 'string') {
               console.warn("Legacy data detected. Resetting to seed.");
               loadedPosts = SEED_POSTS;
            } else {
               loadedPosts = parsed;
            }
          } catch (e) {
            loadedPosts = SEED_POSTS;
          }
        } else {
          loadedPosts = SEED_POSTS;
        }
      }

      setPosts(loadedPosts);

      // --- SEO: Check URL for ?post=ID ---
      const params = new URLSearchParams(window.location.search);
      const postIdFromUrl = params.get('post');
      if (postIdFromUrl) {
        const foundPost = loadedPosts.find(p => p.id === postIdFromUrl);
        if (foundPost) {
          setSelectedPost(foundPost);
        }
      }
    };

    initializeData();

    // Load Stats
    const savedStats = localStorage.getItem(STATS_KEY);
    if (savedStats) {
       setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save to LocalStorage whenever posts change (for manual Admin usage)
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);


  // --- Helper: Logging ---
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      message,
      type
    };
    setLogs(prev => [entry, ...prev].slice(0, 100)); // Keep last 100 logs
  }, []);


  // --- Helper: Business Logic ---
  const selectWeightedCategory = (): Category => {
    const rand = Math.random();
    let sum = 0;
    for (const [cat, weight] of Object.entries(CATEGORY_WEIGHTS)) {
      sum += weight;
      if (rand < sum) return cat as Category;
    }
    return Category.TECH;
  };

  const handlePostClick = (post: Post) => {
    // Monetization Logic: Click adds views and revenue
    setStats(prev => ({
      ...prev,
      totalViews: prev.totalViews + 1,
      totalRevenue: prev.totalRevenue + 0.02
    }));
    
    // Update URL without reloading page (SPA SEO friendly)
    const newUrl = `${window.location.pathname}?post=${post.id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    setSelectedPost(post);
  };

  const handleCloseArticle = () => {
    setSelectedPost(null);
    // Revert URL to home
    const newUrl = window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('آیا از حذف این مقاله اطمینان دارید؟ این عملیات غیرقابل بازگشت است.')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      addLog(`🗑️ Post deleted manually: ${postId}`, 'warning');
    }
  };

  const handleImportPosts = (importedPosts: Post[]) => {
    setPosts(importedPosts);
    addLog(`📥 Database imported successfully: ${importedPosts.length} posts loaded.`, 'success');
  };

  // --- The Generator Loop ---
  const isGeneratingRef = useRef(isGenerating);
  isGeneratingRef.current = isGenerating;

  const performGenerationStep = useCallback(async () => {
    if (!process.env.API_KEY) {
      addLog("API Key missing! Cannot generate.", "error");
      setIsGenerating(false);
      return;
    }

    const category = selectWeightedCategory();
    addLog(`Starting cycle. Category: ${category}`, 'info');

    try {
      // Step 1: Trend
      addLog(`🔍 Searching trends for ${category}...`);
      const { topic, context } = await getTrendingTopic(category);
      addLog(`Topic found: "${topic}"`, 'success');

      // Step 2: Content
      addLog(`✍️ Drafting content...`);
      const contentData = await generateBlogPostContent(topic, context, category);
      addLog(`Content generated: ${contentData.title}`, 'success');

      // Step 3: Visuals
      addLog(`🎨 Generating visuals...`);
      // Use the specific image prompt generated by the content model, fallback to topic
      const visualPrompt = contentData.imagePrompt || `Photorealistic image about ${topic}`;
      const imageUrl = await generatePostImage(visualPrompt, topic);
      
      // Step 4: Assemble
      const author = AUTHORS[category] || AUTHORS[Category.TECH];
      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        title: contentData.title,
        excerpt: contentData.excerpt,
        content: contentData.content,
        category: category,
        imageUrl: imageUrl,
        author: author,
        date: new Date().toLocaleDateString('fa-IR'),
        readTime: contentData.readTime,
        views: 0,
        tags: contentData.tags || [],
        citations: contentData.citations
      };

      // Step 5: Save
      setPosts(prev => [newPost, ...prev]);
      setStats(prev => ({ ...prev, postsGenerated: prev.postsGenerated + 1 }));
      addLog(`✅ Post published successfully!`, 'success');

    } catch (error: any) {
      addLog(`❌ Cycle failed: ${error.message}`, 'error');
    }

    // Schedule next run if still enabled
    if (isGeneratingRef.current) {
      // INCREASED COOLDOWN: 30 Seconds to prevent 429 Rate Limits on Free Tier
      const cooldown = 30000; 
      setNextGenTime(Date.now() + cooldown);
      setTimeout(() => {
        if (isGeneratingRef.current) {
            performGenerationStep();
        }
      }, cooldown);
    }
  }, [addLog]);

  const toggleGeneration = () => {
    const newState = !isGenerating;
    setIsGenerating(newState);
    if (newState) {
      addLog("🚀 Auto-Pilot ENGAGED", 'warning');
      performGenerationStep();
    } else {
      addLog("🛑 Auto-Pilot STOPPED", 'warning');
      setNextGenTime(0);
    }
  };

  // --- Background Traffic Simulation ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Add random organic views occasionally
      if (Math.random() > 0.7) {
        setStats(prev => ({ ...prev, totalViews: prev.totalViews + Math.floor(Math.random() * 5) }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- Render ---
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-100">
      <Helmet>
        <title>فارسی هاب | اخبار تکنولوژی و هوش مصنوعی</title>
        <meta name="description" content="فارسی هاب، مرجع اخبار تکنولوژی، سینما و سبک زندگی با تولید محتوای هوشمند." />
      </Helmet>

      <Header onOpenAdmin={() => setIsAdminOpen(true)} />

      <main className="container mx-auto px-4 py-8 flex-1">
        
        {/* Ad Slot: Top Leaderboard */}
        <div className="mb-8">
           <AdBanner variant="leaderboard" />
        </div>

        {/* Featured / Hero */}
        <section className="mb-12">
          {posts.length > 0 && <Hero post={posts[0]} onClick={handlePostClick} />}
        </section>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Feed */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
              <h3 className="text-2xl font-bold text-white tracking-wide">آخرین نوشته‌ها</h3>
              <div className="flex items-center gap-2">
                 <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <span className="text-sm text-indigo-300">بروزرسانی زنده</span>
              </div>
            </div>
            
            <PostGrid posts={posts.slice(1)} onPostClick={handlePostClick} />
            
            {/* Ad Slot: Feed Bottom */}
            <div className="mt-12">
              <AdBanner variant="leaderboard" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
             <Sidebar 
                trendingPosts={[...posts].sort((a,b) => b.views - a.views).slice(0, 5)} 
                onPostClick={handlePostClick}
             />
          </div>

        </div>
      </main>

      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 mt-12 py-8 text-center text-gray-400 text-sm">
        <p>© 2024 فارسی هاب. تمامی حقوق محفوظ است.</p>
        <p className="mt-2 text-xs opacity-50">Powered by Gemini AI</p>
      </footer>

      {/* Modals */}
      <AdminModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)}
        logs={logs}
        stats={stats}
        isGenerating={isGenerating}
        onToggleGeneration={toggleGeneration}
        nextGenerationTime={nextGenTime}
        posts={posts}
        onDeletePost={handleDeletePost}
        onImportPosts={handleImportPosts}
      />

      <ArticleModal 
        post={selectedPost} 
        onClose={handleCloseArticle} 
      />
    </div>
  );
}

export default App;