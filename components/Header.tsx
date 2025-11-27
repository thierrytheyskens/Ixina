
import React from 'react';
import { Car, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-ixina-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center space-x-4">
          <div className="bg-white px-6 py-2 rounded-lg shadow-sm transform transition-transform hover:scale-105 flex items-center justify-center">
            <span className="text-3xl font-normal text-[#004990] tracking-tighter uppercase font-sans">
              IXINA
            </span>
          </div>
          <div className="hidden md:block w-px h-8 bg-blue-400 opacity-50"></div>
          <h1 className="text-xl md:text-2xl font-bold tracking-wide">
            Valenciennes Generator
          </h1>
        </div>

        {/* DeLorean / Future Reference */}
        <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
          <Car className="w-5 h-5 text-delorean-silver" />
          <span className="text-xs font-mono text-delorean-silver hidden sm:inline-block">
            DOC BROWN ENGINE v2.5
          </span>
          <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
        </div>
      </div>
    </header>
  );
};

export default Header;
