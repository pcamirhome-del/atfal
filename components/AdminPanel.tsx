
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
  
  const [channelUrl, setChannelUrl] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('خطأ في البيانات، يرجى المحاولة مرة أخرى');
    }
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelUrl) return;
    
    // Warn if it's a direct channel link
    if (channelUrl.includes('@') && !channelUrl.includes('list=')) {
      alert('تنبيه: روابط القنوات المباشرة (@handle) يمنعها يوتيوب من العرض. الأفضل استخدام رابط (Playlist) للقناة لضمان عملها بشكل صحيح.');
    }

    onAddVideo({ 
      title: `قناة: ${channelUrl.split('/').pop()?.replace('@', '')}`, 
      url: channelUrl, 
      category: videoCategory,
      isChannel: true 
    });
    setChannelUrl('');
    alert('تمت إضافة الرابط! تأكد من أنه رابط قائمة تشغيل (Playlist) ليعمل بامتياز.');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card login-glow p-12 rounded-[3rem] w-full max-w-md border border-white/30 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl group-hover:bg-sky-400/20"></div>
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 border border-white/20 shadow-xl">🔐</div>
              <h2 className="text-3xl font-black">مدخل المسؤولين</h2>
              <p className="text-white/50 text-sm mt-2">قم بإدخال بياناتك للمتابعة</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <input type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:bg-white/15" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="اسم المستخدم" />
              <input type="password" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:bg-white/15" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              {error && <div className="text-red-400 text-xs text-center">{error}</div>}
              <button className="w-full bg-white text-sky-600 font-black py-4 rounded-2xl shadow-xl hover:bg-sky-50 transition-all">تأكيد الدخول</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regular Video Form */}
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/20">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            <span>✨</span> إضافة فيديو جديد
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            onAddVideo({ title: videoTitle, url: videoUrl, category: videoCategory });
            setVideoTitle(''); setVideoUrl('');
          }} className="space-y-6">
            <input required className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 outline-none focus:bg-white/20" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="عنوان الفيديو (مثلاً: سبايدر مان يحب الفاكهة)" />
            <input required className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 outline-none focus:bg-white/20" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="رابط الفيديو من يوتيوب" />
            <select className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 outline-none text-slate-800" value={videoCategory} onChange={(e) => setVideoCategory(e.target.value)}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button className="w-full bg-green-500 hover:bg-green-400 text-white font-black py-4 rounded-2xl shadow-lg transition-colors">نشر الفيديو الآن 🚀</button>
          </form>
        </div>

        {/* YouTube Channel Support */}
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/20">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            <span>📺</span> ربط مجموعة فيديوهات (قناة)
          </h3>
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl mb-6">
            <p className="text-[11px] text-yellow-200 leading-relaxed">
              <strong>💡 نصيحة تقنية:</strong> يوتيوب يرفض عرض القنوات المباشرة داخل المواقع الأخرى. لضمان عرض "كل الفيديوهات"، يرجى وضع رابط <strong>قائمة تشغيل (Playlist)</strong> من القناة المطلوبة.
            </p>
          </div>
          <form onSubmit={handleAddChannel} className="space-y-6">
            <input required className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 outline-none focus:bg-white/20" value={channelUrl} onChange={(e) => setChannelUrl(e.target.value)} placeholder="رابط قائمة التشغيل (Playlist URL)" />
            <select className="w-full bg-white/10 p-4 rounded-2xl border border-white/10 outline-none text-slate-800" value={videoCategory} onChange={(e) => setVideoCategory(e.target.value)}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button className="w-full bg-red-500 hover:bg-red-400 text-white font-black py-4 rounded-2xl shadow-lg transition-colors">ربط القائمة الآن 🔗</button>
          </form>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] p-10 overflow-hidden">
        <h3 className="text-2xl font-bold mb-6">إدارة المحتوى ({videos.length})</h3>
        <div className="space-y-3">
          {videos.length === 0 ? (
            <div className="text-center py-10 opacity-40">لا توجد فيديوهات حالياً</div>
          ) : (
            videos.map(v => (
              <div key={v.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl hover:bg-white/10 border border-white/5 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                    {v.isChannel ? '📺' : '🎥'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm truncate max-w-[200px]">{v.title}</span>
                    <span className="text-[10px] opacity-40">{categories.find(c => c.id === v.category)?.name}</span>
                  </div>
                </div>
                <button onClick={() => onDeleteVideo(v.id)} className="text-red-400 hover:text-red-100 font-bold px-4 py-2 hover:bg-red-500/20 rounded-xl transition-all">حذف 🗑️</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
