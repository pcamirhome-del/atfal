
import React, { useState } from 'react';
import { AppSettings, AppTheme, VideoQuality } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const themes: { id: AppTheme; name: string; icon: string }[] = [
    { id: 'ios', name: 'آيفون / آبل', icon: '🍎' },
    { id: 'advanced_glass', name: 'الزجاج المطور', icon: '🪄' },
    { id: 'grid_modern', name: 'شبكة هندسية', icon: '🏁' },
    { id: 'default', name: 'الزجاجي الحديث', icon: '🌊' },
    { id: 'skeuomorphic', name: 'سكيو-مورفيزم', icon: '📻' },
    { id: 'aero', name: 'إيرو جلاس', icon: '💎' },
    { id: 'frosted', name: 'زجاج متجمد', icon: '❄️' },
    { id: 'transparent', name: 'شفافية كاملة', icon: '🧊' },
    { id: 'vibrant', name: 'زجاج حيوي', icon: '💥' },
    { id: 'neumorphic', name: 'نيومورفيزم', icon: '⚪' },
    { id: 'retro', name: 'ريترو كلاسيك', icon: '📜' },
    { id: 'futuristic', name: 'خيال علمي', icon: '🤖' },
    { id: 'corporate', name: 'احترافي هادئ', icon: '💼' },
    { id: 'creative', name: 'إبداعي فني', icon: '🎨' },
    { id: 'forest', name: 'الغابة الخضراء', icon: '🌲' },
    { id: 'candy', name: 'عالم الحلوى', icon: '🍭' },
    { id: 'galaxy', name: 'أعماق الفضاء', icon: '🚀' },
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

  const handleToggleParentsTab = () => {
    setShowAuthModal(true);
    setPass('');
    setError(false);
  };

  const verifyPass = () => {
    if (pass === 'admin') {
      onUpdateSettings(p => ({ ...p, showParentsTab: !p.showParentsTab }));
      setShowAuthModal(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fade-in space-y-10">
      <div className="flex items-center gap-6">
        <span className="text-6xl p-4 glass-card rounded-[2rem] reveal-highlight">🎮</span>
        <h2 className="text-5xl font-black tracking-tighter">إعدادات عالمي</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card p-10 rounded-[3rem] space-y-8 reveal-highlight">
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
                    ${settings.defaultQuality === q.id ? 'border-sky-500 bg-sky-500/10' : 'border-transparent bg-white/5'}
                  `}
                >
                  <span className="font-bold">{q.label}</span>
                  {settings.defaultQuality === q.id && <span>✅</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3rem] flex flex-col reveal-highlight">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            <span>🎨</span> ألوان وبريق برنامجي
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 overflow-y-auto max-h-[600px] p-2 custom-scrollbar">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => onUpdateSettings(p => ({ ...p, theme: t.id }))}
                className={`
                  p-4 rounded-[2rem] border-2 transition-all relative overflow-hidden group flex flex-col items-center justify-center text-center reveal-highlight
                  ${settings.theme === t.id ? 'border-sky-500 bg-sky-500/10' : 'border-transparent bg-white/5 hover:bg-white/10'}
                `}
              >
                <span className="text-4xl mb-2 block animate-float" style={{ animationDelay: `${Math.random()}s` }}>{t.icon}</span>
                <span className="font-black text-[10px] block leading-tight">{t.name}</span>
                {settings.theme === t.id && <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80]"></div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] space-y-6 border-white/10 reveal-highlight">
        <h3 className="text-2xl font-black flex items-center gap-3">
          <span>🛡️</span> الرقابة الأبوية والمؤثرات
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={handleToggleParentsTab}
            className={`flex flex-col items-center justify-center p-6 rounded-3xl font-bold transition-all border-2 reveal-highlight
              ${settings.showParentsTab ? 'bg-sky-500 border-white shadow-lg' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'}
            `}
          >
            <span className="text-3xl mb-2">🧔</span>
            <span>فيديوهات الوالد</span>
            <span className="text-[10px] mt-1">{settings.showParentsTab ? 'ظاهرة' : 'مخفية'}</span>
          </button>

          <button 
            onClick={() => onUpdateSettings(p => ({ ...p, isDarkMode: !p.isDarkMode }))}
            className={`flex flex-col items-center justify-center p-6 rounded-3xl font-bold transition-all border-2 reveal-highlight
              ${settings.isDarkMode ? 'bg-indigo-500 border-white shadow-lg' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'}
            `}
          >
            <span className="text-3xl mb-2">{settings.isDarkMode ? '🌙' : '☀️'}</span>
            <span>الوضع الليلي</span>
            <span className="text-[10px] mt-1">{settings.isDarkMode ? 'قيد التشغيل' : 'مغلق'}</span>
          </button>

          <button 
            onClick={() => onUpdateSettings(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
            className={`flex flex-col items-center justify-center p-6 rounded-3xl font-bold transition-all border-2 reveal-highlight
              ${settings.soundEnabled ? 'bg-green-500 border-white shadow-lg' : 'bg-white/5 border-white/10 opacity-60 hover:opacity-100'}
            `}
          >
            <span className="text-3xl mb-2">{settings.soundEnabled ? '🔊' : '🔇'}</span>
            <span>الأصوات</span>
            <span className="text-[10px] mt-1">{settings.soundEnabled ? 'مفعلة' : 'صامت'}</span>
          </button>
        </div>
      </div>

      {/* Parental Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-xl p-6">
          <div className="glass-card p-12 rounded-[3.5rem] w-full max-w-sm text-center border-white/30 animate-scale-up shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="text-6xl mb-6">🔐</div>
            <h3 className="text-2xl font-black mb-2">إذن الوالدين</h3>
            <p className="text-sm opacity-60 mb-8 leading-relaxed">أدخل رمز الإدارة للمتابعة.</p>
            <input 
              type="password" 
              placeholder="admin"
              className="w-full bg-white/10 border border-white/20 p-5 rounded-[2rem] mb-4 text-center text-white outline-none focus:bg-white/20 text-lg tracking-widest"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && verifyPass()}
            />
            {error && <p className="text-red-400 text-xs mb-4 font-bold">كلمة السر خاطئة!</p>}
            <div className="flex gap-4">
              <button onClick={verifyPass} className="flex-1 bg-white text-sky-600 font-black py-4 rounded-[1.5rem] shadow-xl hover:bg-sky-50 transition-colors">تأكيد</button>
              <button onClick={() => setShowAuthModal(false)} className="flex-1 bg-white/10 font-bold py-4 rounded-[1.5rem] hover:bg-white/20 transition-colors text-white">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
