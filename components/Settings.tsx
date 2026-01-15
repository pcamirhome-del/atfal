
import React from 'react';
import { AppSettings, AppTheme } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const themes: { id: AppTheme; name: string; color: string; icon: string }[] = [
    { id: 'default', name: 'الافتراضي الزجاجي', color: 'bg-sky-500', icon: '🌊' },
    { id: 'forest', name: 'الغابة الخضراء', color: 'bg-green-500', icon: '🌲' },
    { id: 'candy', name: 'عالم الحلوى', color: 'bg-pink-500', icon: '🍭' },
    { id: 'galaxy', name: 'الفضاء السحري', color: 'bg-indigo-900', icon: '🚀' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 animate-fade-in">
      <div className="flex items-center gap-4 mb-10">
        <span className="text-5xl">🎨</span>
        <h2 className="text-4xl font-black">لوحة التحكم في المظهر</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[3rem] space-y-8">
          <h3 className="text-2xl font-bold mb-6">الأوضاع العامة</h3>
          
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-3xl">
            <div>
              <p className="font-bold">الوضع الليلي الهادئ</p>
              <p className="text-xs opacity-60">تعديل الإضاءة لنوم هادئ</p>
            </div>
            <button 
              onClick={() => onUpdateSettings(p => ({ ...p, isDarkMode: !p.isDarkMode }))}
              className={`w-16 h-8 rounded-full transition-all p-1 ${settings.isDarkMode ? 'bg-sky-500' : 'bg-white/20'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.isDarkMode ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-3xl">
            <div>
              <p className="font-bold">أصوات الأزرار</p>
              <p className="text-xs opacity-60">نغمات موسيقية عند الضغط</p>
            </div>
            <button 
              onClick={() => onUpdateSettings(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
              className={`w-16 h-8 rounded-full transition-all p-1 ${settings.soundEnabled ? 'bg-green-500' : 'bg-white/20'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3rem]">
          <h3 className="text-2xl font-bold mb-8">اختر ثيم الأطفال المفضل</h3>
          <div className="grid grid-cols-2 gap-4">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => onUpdateSettings(p => ({ ...p, theme: t.id }))}
                className={`
                  p-6 rounded-[2rem] border-2 transition-all group relative overflow-hidden
                  ${settings.theme === t.id ? 'border-white bg-white/20' : 'border-transparent bg-white/5 hover:bg-white/10'}
                `}
              >
                <span className="text-4xl mb-3 block">{t.icon}</span>
                <span className="font-bold text-sm block">{t.name}</span>
                {settings.theme === t.id && <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400"></div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 glass-card p-8 rounded-[2.5rem] text-center border-dashed border-white/20">
        <p className="text-white/70 italic text-sm">"كل الإعدادات يتم حفظها تلقائياً لجهازك يا بطل!"</p>
      </div>
    </div>
  );
};

export default Settings;
