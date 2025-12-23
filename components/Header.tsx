import React from 'react';

interface HeaderProps {
  onOpenAdmin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  return (
    <header className="bg-black/20 backdrop-blur-xl shadow-lg sticky top-0 z-40 border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-indigo-500/50 shadow-lg">
            ف
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight hidden sm:block">
            فارسی <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">هاب</span>
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-gray-300 font-medium">
          <a href="#" className="hover:text-white hover:scale-105 transition duration-300">خانه</a>
          <a href="#" className="hover:text-white hover:scale-105 transition duration-300">تکنولوژی</a>
          <a href="#" className="hover:text-white hover:scale-105 transition duration-300">سینما</a>
          <a href="#" className="hover:text-white hover:scale-105 transition duration-300">سبک زندگی</a>
        </nav>

        <button 
          onClick={onOpenAdmin}
          className="bg-white/10 hover:bg-white/20 hover:scale-105 border border-white/10 text-gray-200 px-5 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 backdrop-blur-sm"
        >
          <span>پنل مدیریت</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543 .826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;