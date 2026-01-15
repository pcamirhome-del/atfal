
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

  // Form states
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
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleSubmitVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl || !videoCategory) return;
    onAddVideo({ title: videoTitle, url: videoUrl, category: videoCategory });
    setVideoTitle('');
    setVideoUrl('');
    alert('تم نشر الفيديو بنجاح! 🎉');
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    onAddCategory(newCatName);
    setNewCatName('');
    alert('تمت إضافة القسم الجديد!');
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-sky-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-center">دخول المسؤولين 🔐</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم المستخدم</label>
              <input 
                type="text" 
                className="w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-700 dark:border-slate-600 outline-sky-500" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">كلمة المرور</label>
              <input 
                type="password" 
                className="w-full p-3 rounded-xl border border-slate-200 dark:bg-slate-700 dark:border-slate-600 outline-sky-500" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full bg-sky-500 text-white font-bold py-3 rounded-xl hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20">
              دخول
            </button>
            <p className="text-center text-xs opacity-50">تلميح: admin / admin</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Add Video Form */}
        <div className="flex-1 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>➕</span> إضافة فيديو جديد
          </h3>
          <form onSubmit={handleSubmitVideo} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">عنوان الفيديو</label>
              <input 
                required
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border-none outline-sky-500"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="مثال: قصة الأسد والذئب"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">رابط الفيديو (YouTube/Direct)</label>
              <input 
                required
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border-none outline-sky-500"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <label className="block text-sm mb-1">القسم</label>
              <select 
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border-none outline-sky-500"
                value={videoCategory}
                onChange={(e) => setVideoCategory(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button className="w-full bg-green-500 text-white font-bold py-4 rounded-2xl hover:bg-green-600 shadow-lg shadow-green-500/20">
              نشر الفيديو الآن 🚀
            </button>
          </form>
        </div>

        {/* Categories & Stats */}
        <div className="w-full md:w-80 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>📁</span> إضافة قسم
            </h3>
            <form onSubmit={handleSubmitCategory} className="space-y-4">
              <input 
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-700 border-none outline-sky-500"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="اسم القسم الجديد"
              />
              <button className="w-full bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-600">
                إضافة (+)
              </button>
            </form>
          </div>

          <div className="bg-sky-500 text-white p-6 rounded-3xl shadow-xl">
            <h4 className="font-bold opacity-80">إحصائيات سريعة</h4>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-4xl font-bold">{videos.length}</span>
              <span className="text-sm">فيديو متاح</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Check Area */}
      {healthReports.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border-2 border-red-200 dark:border-red-900/30">
          <h3 className="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
            <span>🚨</span> تنبيهات الروابط المعطلة
          </h3>
          <div className="space-y-3">
            {healthReports.map(report => (
              <div key={report.videoId} className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                <div>
                  <h4 className="font-bold">الفيديو: {report.videoTitle}</h4>
                  <p className="text-sm text-red-500">{report.error}</p>
                </div>
                <button 
                  onClick={() => onClearReport(report.videoId)}
                  className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 rounded-lg"
                >
                  تجاهل وتصفير
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Management List */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl overflow-hidden">
        <h3 className="text-xl font-bold mb-6">قائمة المحتوى</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b dark:border-slate-700 opacity-60 text-sm">
                <th className="pb-4 font-medium">العنوان</th>
                <th className="pb-4 font-medium">القسم</th>
                <th className="pb-4 font-medium">الحالة</th>
                <th className="pb-4 font-medium">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {videos.map(v => (
                <tr key={v.id}>
                  <td className="py-4">{v.title}</td>
                  <td className="py-4">{v.category}</td>
                  <td className="py-4">
                    {v.isBroken ? (
                      <span className="text-red-500 text-xs font-bold">بـه مشكلة!</span>
                    ) : (
                      <span className="text-green-500 text-xs">سليم ✅</span>
                    )}
                  </td>
                  <td className="py-4">
                    <button 
                      onClick={() => onDeleteVideo(v.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
