
import React from 'react';
import { AppSettings, AppTheme, VideoQuality } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const themes: { id: AppTheme; name: string; icon: string }[] = [
    { id: 'default', name: 'الزجاجي', icon: '🌊' },
    { id: 'forest', name: 'الغابة', icon: '🌲' },
    { id: 'candy', name: 'الحلوى', icon: '🍭' },
    { id: 'galaxy', name: 'الفضاء', icon: '🚀' },
  ];

  const qualities: { id: VideoQuality; label: string }[] = [
    { id: 'hd1080', label: '1080p الممتازة' },
    { id: 'hd720', label: '720p العالية' },
    { id: 'large', label: '480p المتوسطة' },
    { id: 'medium', label: '360p العادية' },
    { id: 'small', label: '240p المنخفضة' },
    { id: 'tiny', label: '144p التوفير القصوى' },
    { id: 'auto', label: 'تلقائي' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 animate-fade-in space-y-10">
      <div className="flex items-center gap-6">
        <span className="text-6xl p-4 glass-card rounded-[2rem]">🎮</span>
        <h2 className="text-5xl font-black tracking-tighter">إعدادات عالمي</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card p-10 rounded-[3rem] space-y-8">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <span>⚙️</span> خيارات العرض
          </h3>
          
          <div className="space-y-4">
            <p className="font-bold opacity-60">جودة الفيديوهات الافتراضية:</p>
            <div className="grid grid-cols-1 gap-3">
              {qualities.map(q => (
                <button
                  key={q.id}
                  onClick={() => onUpdateSettings(p => ({ ...p, defaultQuality: q.id }))}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all
                    ${settings.defaultQuality === q.id ? 'border-white bg-white/20' : 'border-transparent bg-white/5'}
                  `}
                >
                  <span className="font-bold">{q.label}</span>
                  {settings.defaultQuality === q.id && <span>✅</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3rem]">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            <span>🎨</span> ألوان برنامجي
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => onUpdateSettings(p => ({ ...p, theme: t.id }))}
                className={`
                  p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden group
                  ${settings.theme === t.id ? 'border-white bg-white/20' : 'border-transparent bg-white/5 hover:bg-white/10'}
                `}
              >
                <span className="text-5xl mb-4 block animate-float">{t.icon}</span>
                <span className="font-black text-sm block">{t.name}</span>
                {settings.theme === t.id && <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 border-white/10">
        <div>
          <h4 className="text-xl font-bold">الوضع الليلي والمؤثرات</h4>
          <p className="text-sm opacity-50">تحكم في الأصوات وإضاءة الشاشة</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => onUpdateSettings(p => ({ ...p, isDarkMode: !p.isDarkMode }))}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${settings.isDarkMode ? 'bg-sky-500 text-white' : 'bg-white/10'}`}
          >
            الوضع الليلي {settings.isDarkMode ? 'قيد التشغيل' : 'مغلق'}
          </button>
          <button 
            onClick={() => onUpdateSettings(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
            className={`px-8 py-4 rounded-2xl font-bold transition-all ${settings.soundEnabled ? 'bg-green-500 text-white' : 'bg-white/10'}`}
          >
            الأصوات {settings.soundEnabled ? 'مفعلة' : 'صامت'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
