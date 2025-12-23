import React from 'react';
import { Post } from '../types';

interface PostGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

const PostGrid: React.FC<PostGridProps> = ({ posts, onPostClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {posts.map((post) => (
        <article 
          key={post.id} 
          className="group bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-indigo-500/50 transition duration-500 cursor-pointer flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-500/20"
          onClick={() => onPostClick(post)}
        >
          <div className="h-56 overflow-hidden relative">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
              {post.category}
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-100 mb-3 leading-snug group-hover:text-indigo-400 transition">
              {post.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
              <div className="flex items-center gap-2">
                <img src={post.author.avatar} alt="" className="w-6 h-6 rounded-full ring-2 ring-indigo-500/50" />
                <span className="text-xs text-gray-400 font-medium group-hover:text-gray-200 transition">{post.author.name}</span>
              </div>
              <span className="text-xs text-gray-500">{post.date}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default PostGrid;