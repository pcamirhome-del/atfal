
import React, { useState, useEffect, useCallback } from 'react';
import { CategoryType, Video, AppSettings, HealthCheckReport } from './types';
import { DEFAULT_CATEGORIES, CLICK_SOUND_URL } from './constants';
import { getEmbedUrl, generateId } from './services/videoService';
import Sidebar from './components/Sidebar';
import VideoCard from './components/VideoCard';
import AdminPanel from './components/AdminPanel';
import Settings from './components/Settings';

const App: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<CategoryType>('home');
  const [videos, setVideos] = useState<Video[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<AppSettings>({
    isDarkMode: false,
    soundEnabled: true,
  });
  const [healthReports, setHealthReports] = useState<HealthCheckReport[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    const storedVideos = localStorage.getItem('ahbab_videos');
    const storedSaved = localStorage.getItem('ahbab_saved');
    const storedCats = localStorage.getItem('ahbab_categories');
    const storedSettings = localStorage.getItem('ahbab_settings');

    if (storedVideos) setVideos(JSON.parse(storedVideos));
    else {
      // Dummy data for first run
      const initialVideos: Video[] = [
        { id: generateId(), title: 'قصة الأرنب والسلحفاة', url: 'https://www.youtube.com/watch?v=0W86V-D6Y24', category: 'stories', timestamp: Date.now() },
        { id: generateId(), title: 'تعليم الحروف العربية', url: 'https://www.youtube.com/watch?v=pS1vP0mO2sU', category: 'educational', timestamp: Date.now() },
        { id: generateId(), title: 'أغنية الألوان للأطفال', url: 'https://www.youtube.com/watch?v=8V3-HlI58o4', category: 'songs', timestamp: Date.now() },
      ];
      setVideos(initialVideos);
      localStorage.setItem('ahbab_videos', JSON.stringify(initialVideos));
    }

    if (storedSaved) setSavedIds(JSON.parse(storedSaved));
    if (storedCats) setCategories(JSON.parse(storedCats));
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('ahbab_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('ahbab_saved', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem('ahbab_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('ahbab_settings', JSON.stringify(settings));
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // --- Handlers ---
  const playClick = useCallback(() => {
    if (settings.soundEnabled) {
      const audio = new Audio(CLICK_SOUND_URL);
      audio.play().catch(() => {});
    }
  }, [settings.soundEnabled]);

  const handleTabChange = (tab: CategoryType) => {
    playClick();
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleSaveVideo = (id: string) => {
    playClick();
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAddVideo = (newVideo: Omit<Video, 'id' | 'timestamp'>) => {
    const video: Video = {
      ...newVideo,
      id: generateId(),
      timestamp: Date.now(),
    };
    setVideos(prev => [video, ...prev]);
  };

  const handleAddCategory = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    setCategories(prev => [...prev, {
      id,
      name,
      icon: '✨',
      color: 'bg-purple-100 text-purple-600'
    }]);
  };

  const handleReportError = (videoId: string, errorMsg: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    if (!healthReports.find(r => r.videoId === videoId)) {
      setHealthReports(prev => [...prev, { videoId, videoTitle: video.title, error: errorMsg }]);
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, isBroken: true } : v));
    }
  };

  const clearBrokenReport = (videoId: string) => {
    setHealthReports(prev => prev.filter(r => r.videoId !== videoId));
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, isBroken: false } : v));
  };

  // --- Filtered Data ---
  const getFilteredVideos = () => {
    if (activeTab === 'home') return videos;
    if (activeTab === 'saved') return videos.filter(v => savedIds.includes(v.id));
    return videos.filter(v => v.category === activeTab);
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${settings.isDarkMode ? 'bg-slate-900 text-white' : 'bg-sky-50 text-slate-800'}`}>
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 shadow-md flex items-center justify-between px-4 z-50">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-2xl">☰</button>
        <h1 className="text-xl font-bold text-sky-600">أحباب الله</h1>
        <div className="w-8"></div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        categories={categories}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDarkMode={settings.isDarkMode}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'admin' ? (
            <AdminPanel 
              onAddVideo={handleAddVideo} 
              onAddCategory={handleAddCategory}
              categories={categories}
              healthReports={healthReports}
              onClearReport={clearBrokenReport}
              videos={videos}
              onDeleteVideo={(id) => setVideos(prev => prev.filter(v => v.id !== id))}
            />
          ) : activeTab === 'settings' ? (
            <Settings 
              settings={settings} 
              onUpdateSettings={setSettings}
            />
          ) : (
            <section>
              <header className="mb-8 text-center lg:text-right">
                <h2 className="text-3xl font-bold mb-2">
                  {activeTab === 'home' ? 'مرحباً بك في عالمنا!' : 
                   activeTab === 'saved' ? 'محتواي المفضل' : 
                   categories.find(c => c.id === activeTab)?.name || 'القسم'}
                </h2>
                <p className="opacity-70">اخترنا لك أفضل الفيديوهات التعليمية والترفيهية</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredVideos().length > 0 ? (
                  getFilteredVideos().map(video => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      isSaved={savedIds.includes(video.id)}
                      onSave={() => handleSaveVideo(video.id)}
                      onReportError={(err) => handleReportError(video.id, err)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="text-6xl mb-4">🎈</div>
                    <p className="text-xl opacity-60">لا يوجد محتوى في هذا القسم حالياً.</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Background Decor */}
      <div className="fixed bottom-0 right-0 p-8 pointer-events-none opacity-20 hidden lg:block">
        <div className="text-8xl">🌈</div>
      </div>
    </div>
  );
};

export default App;
