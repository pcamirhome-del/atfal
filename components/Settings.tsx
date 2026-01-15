
import React from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const toggleDarkMode = () => {
    onUpdateSettings(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const toggleSound = () => {
    onUpdateSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span>⚙️</span> إعدادات التطبيق
      </h2>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl space-y-8">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">الوضع الليلي</h3>
            <p className="opacity-60 text-sm">تحويل الألوان إلى ألوان هادئة للعين قبل النوم</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`
              relative w-16 h-8 rounded-full transition-colors duration-300
              ${settings.isDarkMode ? 'bg-indigo-600' : 'bg-slate-200'}
            `}
          >
            <div className={`
              absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md
              ${settings.isDarkMode ? 'translate-x-8' : 'translate-x-0'}
            `} />
          </button>
        </div>

        <hr className="dark:border-slate-700" />

        {/* Sound Effects */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">أصوات التفاعل</h3>
            <p className="opacity-60 text-sm">تشغيل أصوات نقرات عند التنقل بين الأقسام</p>
          </div>
          <button 
            onClick={toggleSound}
            className={`
              relative w-16 h-8 rounded-full transition-colors duration-300
              ${settings.soundEnabled ? 'bg-green-500' : 'bg-slate-200'}
            `}
          >
            <div className={`
              absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md
              ${settings.soundEnabled ? 'translate-x-8' : 'translate-x-0'}
            `} />
          </button>
        </div>

        <div className="pt-6">
          <div className="bg-sky-50 dark:bg-sky-900/20 p-6 rounded-2xl text-center">
            <p className="text-sm opacity-80 leading-relaxed">
              تطبيق "أحباب الله" صمم بحب ليكون مكاناً آمناً وممتعاً لأطفالنا الصغار.
              جميع الإعدادات يتم حفظها تلقائياً على جهازك.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
