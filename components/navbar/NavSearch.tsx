
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { GlobalSearch } from '../GlobalSearch';

export const NavSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  return (
    <div className="hidden md:flex items-center flex-1 max-w-md" ref={searchContainerRef}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search docs, deals, or ask AI..." 
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowSearchResults(true)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
        {showSearchResults && (
          <GlobalSearch query={searchQuery} onClose={() => setShowSearchResults(false)} />
        )}
      </div>
    </div>
  );
};
