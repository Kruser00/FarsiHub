import React from 'react';
import { Post } from '../types';

interface HeroProps {
  post: Post | null;
  onClick: (post: Post) => void;
}

const Hero: React.FC<HeroProps> = ({ post, onClick }) => {
  if (!post) return null;

  return (
    <div className="relative w-full h-[500px] bg-gray-900 overflow-hidden rounded-2xl shadow-xl group cursor-pointer" onClick={() => onClick(post)}>
      <img 
        src={post.imageUrl} 
        alt={post.title} 
        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
      
      <div className="absolute bottom-0 right-0 p-8 md:p-12 w-full md:w-2/3">
        <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
          {post.category}
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {post.title}
        </h2>
        <p className="text-gray-300 text-lg mb-6 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <img src={post.author.avatar} className="w-8 h-8 rounded-full border border-gray-600" alt={post.author.name} />
            <span>{post.author.name}</span>
          </div>
          <span>•</span>
          <span>{post.readTime} مطالعه</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;