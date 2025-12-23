import React, { useEffect } from 'react';
import { Post } from '../types';
import AdBanner from './AdBanner';

interface ArticleModalProps {
  post: Post | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ post, onClose }) => {
  // SEO & Metadata Injection
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | فارسی هاب`;
      
      // Inject Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', post.excerpt);

      // Inject JSON-LD
      const scriptId = 'json-ld-article';
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
      
      const scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.imageUrl,
        "author": {
          "@type": "Person",
          "name": post.author.name
        },
        "publisher": {
          "@type": "Organization",
          "name": "FarsiHub",
          "logo": {
            "@type": "ImageObject",
            "url": "https://via.placeholder.com/100" // Placeholder logo
          }
        },
        "datePublished": post.date, // Note: Should be ISO format in real app
        "description": post.excerpt
      };
      scriptTag.innerHTML = JSON.stringify(structuredData);
      document.head.appendChild(scriptTag);
    } else {
      document.title = "فارسی هاب | FarsiHub";
    }

    return () => {
      document.title = "فارسی هاب | FarsiHub";
    };
  }, [post]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto bg-slate-900 min-h-screen shadow-2xl relative border-x border-white/10">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="fixed top-4 left-4 md:top-8 md:left-8 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full shadow-lg border border-white/10 transition backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Article Header */}
        <div className="relative h-[400px] md:h-[500px]">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          <div className="absolute bottom-0 right-0 p-8 md:p-12 w-full">
             <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-4 inline-block shadow-lg shadow-indigo-600/30">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <img src={post.author.avatar} className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-lg" alt="" />
              <div>
                <p className="font-bold text-lg">{post.author.name}</p>
                <p className="text-sm text-gray-300">{post.date} • {post.readTime} مطالعه</p>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-8 md:p-16">
          <div 
            className="prose prose-lg prose-invert max-w-none text-gray-300 leading-loose prose-a:text-indigo-400 prose-headings:text-white prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Ad Slot: In-Article / Bottom */}
          <div className="my-12">
            <AdBanner variant="leaderboard" />
          </div>

          {/* Citations/References */}
          {post.citations && post.citations.length > 0 && (
            <div className="mt-8 p-6 bg-black/30 rounded-xl border border-white/10">
              <h4 className="font-bold text-gray-200 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                منابع و مراجع
              </h4>
              <ul className="space-y-2">
                {post.citations.map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm break-all dir-ltr text-left block transition">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/10 hover:border-indigo-500/50 cursor-pointer transition">
                #{tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ArticleModal;