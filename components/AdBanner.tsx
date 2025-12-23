import React from 'react';

interface AdBannerProps {
  variant?: 'leaderboard' | 'rectangle' | 'vertical';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ variant = 'leaderboard', className = '' }) => {
  // Determine dimensions based on variant
  const getDimensions = () => {
    switch (variant) {
      case 'rectangle': return 'h-[250px] w-full'; // Standard Medium Rectangle
      case 'vertical': return 'h-[600px] w-full'; // Skyscraper
      case 'leaderboard':
      default: return 'h-[90px] w-full'; // Standard Leaderboard
    }
  };

  return (
    <div className={`bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden relative group flex flex-col items-center justify-center my-6 ${getDimensions()} ${className}`}>
      
      {/* Ad Label (Compliance) */}
      <div className="absolute top-0 right-0 bg-white/10 px-2 py-1 text-[10px] text-gray-400 rounded-bl-lg backdrop-blur-md z-20">
        تبلیغات
      </div>
      
      {/* Placeholder Content - Replace this div with Adivery Script in production */}
      <div className="text-center z-10 opacity-60 group-hover:opacity-100 transition duration-300">
         <span className="text-gray-600 font-mono text-xs uppercase tracking-widest block mb-1">Adivery Ad Space</span>
         <span className="text-indigo-500/50 text-[10px]">{variant.toUpperCase()} SLOT</span>
      </div>

      {/* Visual Placeholder Effects (Grid pattern) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5"></div>
      
      {/* Dashed Border for placement visibility */}
      <div className="absolute inset-2 border border-dashed border-white/10 rounded-lg pointer-events-none"></div>
    </div>
  );
};

export default AdBanner;