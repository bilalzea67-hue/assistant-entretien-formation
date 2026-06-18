'use client';

import { Search, Plus, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const setAddModalOpen = useAppStore((state) => state.setAddModalOpen);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="h-16 bg-white flex items-center justify-between px-10 sticky top-0 z-10 border-b border-gray-100">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-100">
            F
          </div>
          <h2 className="text-sm font-black text-[#172b4d] uppercase tracking-[0.2em]">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className={`relative flex items-center transition-all duration-300 ${isSearchFocused ? 'w-80' : 'w-48'}`}>
          <Search className={`absolute left-3 transition-colors ${isSearchFocused ? 'text-blue-600' : 'text-gray-300'}`} size={14} />
          <input
            type="text"
            placeholder="Rechercher un dossier..."
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-100 text-xs font-bold transition-all placeholder:text-gray-300"
          />
        </div>

        <button 
          onClick={() => setAddModalOpen(true)}
          className="btn-primary py-2 px-6"
        >
          <Plus size={16} strokeWidth={3} />
          <span className="uppercase tracking-widest text-[10px]">Nouveau Dossier</span>
        </button>

        <div className="h-8 w-px bg-gray-100" />
        
        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs shadow-sm cursor-pointer hover:bg-blue-600 hover:text-white transition-all">
          BZ
        </div>
      </div>
    </header>
  );
}
