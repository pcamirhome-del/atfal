
import React from 'react';
import { CategoryType } from '../types';

interface SidebarProps {
  activeTab: CategoryType;
  onTabChange: (tab: CategoryType) => void;
  categories: Array<{ id: string; name: string; icon: string }>;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, categories, isOpen, onClose, isDarkMode }) => {
  const menuItems = [
    { id: 'home', name: 'الرئيسية', icon: '🏠' },
    ...categories,
    { id: 'saved', name: 'المحتوى المحفوظ', icon: '⭐' },
    { id: 'settings', name: 'الإعدادات', icon: '⚙️' },
    { id: 'admin', name: 'لوحة التحكم', icon: '🔐' },
  ];

  return (
    <aside className={`
      fixed lg:sticky top-0 right-0 h-screen w-[280px] z-50
      transform transition-all duration-700 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      glass-nav border-l border-white/10 shadow-2xl overflow-hidden
    `}>
      <div className="p-6 h-full flex flex-col">
        {/* Header - Compact */}
        <div className="flex items-center gap-4 mb-8 px-2">
          <div className="w-12 h-12 bg-white/10 rounded-[1.2rem] flex items-center justify-center text-3xl shadow-xl border border-white/20 animate-float">
            🎨
          </div>
          <div>
            <h1 className="text-xl font-black text-white leading-none">أحباب الله</h1>
            <p className="text-[8px] mt-1 text-white/40 uppercase tracking-widest">Safe Kids Space</p>
          </div>
        </div>

        {/* Navigation - No Scroll if possible */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar-hide flex flex-col justify-start">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as CategoryType)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-bold transition-all duration-300 nav-item-glow
                ${activeTab === item.id 
                  ? 'bg-white/20 text-white shadow-xl border border-white/30 scale-[1.03]' 
                  : 'text-white/60 hover:text-white'
                }
              `}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="tracking-tight truncate">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/5 text-center">
          <p className="text-[8px] opacity-30 font-bold uppercase tracking-widest">Premium 2.5 AI</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
