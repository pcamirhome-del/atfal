
import React from 'react';
import { CategoryType } from '../types';

interface SidebarProps {
  activeTab: CategoryType;
  onTabChange: (tab: CategoryType) => void;
  categories: Array<{ id: string; name: string; icon: string }>;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  showParentsTab?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, categories, isOpen, onClose, isDarkMode, showParentsTab }) => {
  const menuItems = [
    { id: 'home', name: 'الرئيسية', icon: '🏠' },
    ...categories,
    { id: 'saved', name: 'المحتوى المحفوظ', icon: '⭐' },
    ...(showParentsTab ? [{ id: 'parents-videos', name: 'فيديوهات الوالد', icon: '🧔' }] : []),
    { id: 'settings', name: 'الإعدادات', icon: '⚙️' },
    { id: 'admin', name: 'لوحة التحكم', icon: '🔐' },
  ];

  return (
    <aside className={`
      fixed lg:sticky top-0 right-0 h-screen w-[260px] z-50
      transform transition-all duration-700 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      glass-nav border-l border-white/10 shadow-2xl overflow-hidden
    `}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6 px-1 mt-2">
          <div className="w-10 h-10 bg-white/10 rounded-[1rem] flex items-center justify-center text-2xl shadow-xl border border-white/20 animate-float">
            🎨
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-none">أحباب الله</h1>
            <p className="text-[7px] mt-0.5 text-white/40 uppercase tracking-widest">Premium Kids Space</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar-hide flex flex-col justify-start">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as CategoryType)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 nav-item-glow
                ${activeTab === item.id 
                  ? 'bg-white/20 text-white shadow-xl border border-white/30 scale-[1.02]' 
                  : 'text-white/60 hover:text-white'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="tracking-tight truncate">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-3 border-t border-white/5 text-center">
          <p className="text-[7px] opacity-30 font-bold uppercase tracking-widest">Premium 2.5 AI Secure</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
