
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
    <>
      <aside className={`
        fixed lg:static top-0 right-0 h-full w-72 z-50
        transform transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        glass-nav
      `}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/30">
              🌈
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">أحباب الله</h1>
              <span className="text-xs opacity-60">عالم الطفل السعيد</span>
            </div>
          </div>

          <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as CategoryType)}
                className={`
                  w-full flex items-center gap-5 px-5 py-4 rounded-2xl text-lg font-bold transition-all duration-300
                  ${activeTab === item.id 
                    ? 'bg-white/30 text-white shadow-xl scale-105 border border-white/40' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] opacity-40 uppercase tracking-widest">Premium Kids App</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
