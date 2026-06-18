'use client';

import { Kanban, User, LogOut } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  return (
    <div className="w-20 border-r border-gray-100 h-screen flex flex-col bg-white sticky top-0 items-center py-8 gap-10">
      <div className="w-10 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center text-white font-bold italic">
        F
      </div>

      <nav className="flex-1 flex flex-col gap-6">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center cursor-pointer transition-all hover:scale-110 shadow-sm border border-blue-100">
          <Kanban size={22} />
        </div>
      </nav>

      <div className="flex flex-col gap-6 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
          <User size={20} />
        </div>
        <div className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors">
          <LogOut size={20} />
        </div>
      </div>
    </div>
  );
}
