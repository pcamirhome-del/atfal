
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
      {/* Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static top-0 right-0 h-full w-72 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        ${isDarkMode ? 'bg-slate-800 border-l border-slate-700' : 'bg-white border-l border-sky-100'}
        shadow-2xl lg:shadow-none
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-sky-500/30">
              👶
            </div>
            <h1 className="text-2xl font-bold text-sky-500">أحباب الله</h1>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as CategoryType)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-lg font-medium transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 scale-[1.02]' 
                    : isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-sky-50'
                  }
                `}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className={`mt-auto pt-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
            <p className="text-center text-xs opacity-40">أحباب الله © 2024</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
