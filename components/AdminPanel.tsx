
import React, { useState } from 'react';
import { Video, HealthCheckReport } from '../types';

interface AdminPanelProps {
  onAddVideo: (video: Omit<Video, 'id' | 'timestamp'>) => void;
  onAddCategory: (name: string) => void;
  categories: Array<{ id: string; name: string }>;
  healthReports: HealthCheckReport[];
  onClearReport: (videoId: string) => void;
  videos: Video[];
  onDeleteVideo: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onAddVideo, onAddCategory, categories, healthReports, onClearReport, videos, onDeleteVideo 
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCategory, setVideoCategory] = useState(categories[0]?.id || '');
  const [newCatName, setNewCatName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('خطأ في البيانات، يرجى المحاولة مرة أخرى');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card login-glow p-12 rounded-[3rem] w-full max-w-md transition-all duration-500 border border-white/30 relative overflow-hidden group">
          {/* Animated background element for login card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-400/20 rounded-full blur-3xl group-hover:bg-sky-400/40 transition-all duration-700"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 border border-white/20 shadow-xl">
                🔐
              </div>
              <h2 className="text-3xl font-black">مدخل المسؤولين</h2>
              <p className="text-white/50 text-sm mt-2">منطقة خاصة لإدارة محتوى التطبيق</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold px-2">اسم المستخدم</label>
                <input 
                  type="text" 
                  className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl outline-none focus:bg-white/20 transition-all text-white placeholder-white/30" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold px-2">كلمة المرور</label>
                <input 
                  type="password" 
                  className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl outline-none focus:bg-white/20 transition-all text-white placeholder-white/30" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-xl text-center text-xs border border-red-500/30 animate-shake">{error}</div>}

              <button className="w-full bg-white text-sky-600 font-black py-4 rounded-2xl hover:bg-sky-50 transition-all shadow-2xl active:scale-95">
                تأكيد الدخول
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 glass-card p-10 rounded-[2.5rem] border border-white/20">
          <h3 className="text-2xl font-black mb-8">✨ إضافة فيديو جديد</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            onAddVideo({ title: videoTitle, url: videoUrl, category: videoCategory });
            setVideoTitle(''); setVideoUrl('');
          }} className="space-y-6">
            <input 
              required className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 outline-none focus:bg-white/20"
              value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="اسم الفيديو الشيق"
            />
            <input 
              required className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 outline-none focus:bg-white/20"
              value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="رابط يوتيوب هنا"
            />
            <select 
              className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 outline-none appearance-none"
              value={videoCategory} onChange={(e) => setVideoCategory(e.target.value)}
            >
              {categories.map(c => <option key={c.id} value={c.id} className="text-slate-800">{c.name}</option>)}
            </select>
            <button className="w-full bg-green-500 text-white font-black py-4 rounded-2xl hover:bg-green-600 shadow-lg">نشر الآن</button>
          </form>
        </div>

        <div className="w-full md:w-80 glass-card p-10 rounded-[2.5rem]">
          <h3 className="text-xl font-bold mb-6">➕ قسم جديد</h3>
          <form onSubmit={(e) => { e.preventDefault(); onAddCategory(newCatName); setNewCatName(''); }} className="space-y-4">
            <input className="w-full bg-white/10 p-4 rounded-xl border border-white/10" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="اسم القسم" />
            <button className="w-full bg-sky-500 font-bold py-3 rounded-xl">إضافة</button>
          </form>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] p-10">
          <h3 className="text-2xl font-bold mb-6">قائمة المحتوى المتاحة</h3>
          <div className="space-y-4">
            {videos.map(v => (
              <div key={v.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
                <span className="font-bold">{v.title}</span>
                <button onClick={() => onDeleteVideo(v.id)} className="text-red-400 hover:text-red-600 font-bold">حذف 🗑️</button>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default AdminPanel;
