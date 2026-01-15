
import React, { useState, useEffect, useCallback } from 'react';
import { CategoryType, Video, AppSettings, HealthCheckReport, AppTheme } from './types';
import { DEFAULT_CATEGORIES, CLICK_SOUND_URL } from './constants';
import { getEmbedUrl, generateId } from './services/videoService';
import Sidebar from './components/Sidebar';
import VideoCard from './components/VideoCard';
import AdminPanel from './components/AdminPanel';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryType>('home');
  const [videos, setVideos] = useState<Video[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<AppSettings>({
    isDarkMode: false,
    soundEnabled: true,
    theme: 'default'
  });
  const [healthReports, setHealthReports] = useState<HealthCheckReport[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedVideos = localStorage.getItem('ahbab_videos');
    const storedSaved = localStorage.getItem('ahbab_saved');
    const storedCats = localStorage.getItem('ahbab_categories');
    const storedSettings = localStorage.getItem('ahbab_settings');

    if (storedVideos) setVideos(JSON.parse(storedVideos));
    if (storedSaved) setSavedIds(JSON.parse(storedSaved));
    if (storedCats) setCategories(JSON.parse(storedCats));
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('ahbab_videos', JSON.stringify(videos));
    localStorage.setItem('ahbab_saved', JSON.stringify(savedIds));
    localStorage.setItem('ahbab_categories', JSON.stringify(categories));
    localStorage.setItem('ahbab_settings', JSON.stringify(settings));

    // Apply Theme Classes to Body
    document.body.className = `bg-theme-${settings.theme} transition-all duration-700`;
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [videos, savedIds, categories, settings]);

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
    const video: Video = { ...newVideo, id: generateId(), timestamp: Date.now() };
    setVideos(prev => [video, ...prev]);
  };

  const handleAddCategory = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    setCategories(prev => [...prev, { id, name, icon: '✨', color: 'bg-white/10 text-white' }]);
  };

  return (
    <div className="min-h-screen flex text-white overflow-hidden relative">
      
      {/* Background Shapes for extra kids vibe */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 text-6xl animate-bounce delay-75">☁️</div>
        <div className="absolute top-40 right-20 text-4xl animate-pulse">🌟</div>
        <div className="absolute bottom-20 left-1/4 text-7xl opacity-50">🧸</div>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        categories={categories}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDarkMode={settings.isDarkMode}
      />

      {/* Main Content Area */}
      <main 
        className={`flex-1 p-4 lg:p-8 mt-16 lg:mt-0 transition-all duration-300 relative z-10 overflow-y-auto h-screen`}
        onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
      >
        <div className="max-w-7xl mx-auto">
          {activeTab === 'admin' ? (
            <AdminPanel 
              onAddVideo={handleAddVideo} 
              onAddCategory={handleAddCategory}
              categories={categories}
              healthReports={healthReports}
              onClearReport={(id) => setHealthReports(prev => prev.filter(r => r.videoId !== id))}
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
              <header className="mb-12 text-center lg:text-right">
                <div className="inline-block p-4 rounded-3xl glass-card mb-4">
                  <h2 className="text-4xl font-black drop-shadow-md">
                    {activeTab === 'home' ? 'عالم أحباب الله 🎈' : 
                     activeTab === 'saved' ? 'كنزي المفضل ⭐' : 
                     categories.find(c => c.id === activeTab)?.name || 'القسم'}
                  </h2>
                </div>
                <p className="text-white/80 text-lg">استمتع بأجمل اللحظات التعليمية والترفيهية</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(activeTab === 'home' ? videos : activeTab === 'saved' ? videos.filter(v => savedIds.includes(v.id)) : videos.filter(v => v.category === activeTab)).map(video => (
                  <VideoCard 
                    key={video.id} 
                    video={video} 
                    isSaved={savedIds.includes(video.id)}
                    onSave={() => handleSaveVideo(video.id)}
                    onReportError={() => {}}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-nav flex items-center justify-between px-6 z-40">
        <button onClick={() => setIsSidebarOpen(true)} className="text-2xl">☰</button>
        <span className="font-bold text-xl">أحباب الله</span>
        <span className="text-2xl">✨</span>
      </div>
    </div>
  );
};

export default App;
