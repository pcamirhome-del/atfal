
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CategoryType, Video, AppSettings, HealthCheckReport, AppTheme, VideoQuality } from './types';
import { DEFAULT_CATEGORIES, CLICK_SOUND_URL } from './constants';
import { getEmbedUrl, generateId } from './services/videoService';
import Sidebar from './components/Sidebar';
import VideoCard from './components/VideoCard';
import AdminPanel from './components/AdminPanel';
import Settings from './components/Settings';
import SearchBar from './components/SearchBar';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CategoryType>('home');
  const [videos, setVideos] = useState<Video[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<AppSettings>({
    isDarkMode: false,
    soundEnabled: true,
    theme: 'default',
    defaultQuality: 'hd720',
    showParentsTab: false
  });
  const [healthReports, setHealthReports] = useState<HealthCheckReport[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSearchResults, setAiSearchResults] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // State for Theater Mode / Focused Video
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isFullWidth, setIsFullWidth] = useState(false);

  // AI Client
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    const storedVideos = localStorage.getItem('ahbab_videos');
    const storedSaved = localStorage.getItem('ahbab_saved');
    const storedCats = localStorage.getItem('ahbab_categories');
    const storedSettings = localStorage.getItem('ahbab_settings');

    if (storedVideos) setVideos(JSON.parse(storedVideos));
    if (storedSaved) setSavedIds(JSON.parse(storedSaved));
    if (storedCats) setCategories(JSON.parse(storedCats));
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      setSettings({ ...settings, ...parsed });
    }

    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    localStorage.setItem('ahbab_videos', JSON.stringify(videos));
    localStorage.setItem('ahbab_saved', JSON.stringify(savedIds));
    localStorage.setItem('ahbab_categories', JSON.stringify(categories));
    localStorage.setItem('ahbab_settings', JSON.stringify(settings));

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
    setSearchQuery('');
    setAiSearchResults(null);
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

  const handleAiSearch = async (query: string) => {
    if (!query.trim()) {
      setAiSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      if (!aiRef.current) {
        aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
      }

      const videoListString = videos.map(v => `ID: ${v.id}, Title: ${v.title}`).join('\n');
      const response = await aiRef.current.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given the following list of videos for children:\n${videoListString}\n\nUser query: "${query}"\n\nReturn ONLY a JSON array of the IDs (strings) of the top 5 most relevant videos to the query. If none are relevant, return an empty array [].`,
      });

      const text = response.text || '[]';
      const cleanJson = text.replace(/```json|```/g, '').trim();
      const matchIds = JSON.parse(cleanJson);
      setAiSearchResults(matchIds);
    } catch (error) {
      console.error("AI Search Error:", error);
      const fallback = videos
        .filter(v => v.title.toLowerCase().includes(query.toLowerCase()))
        .map(v => v.id);
      setAiSearchResults(fallback);
    } finally {
      setIsSearching(false);
    }
  };

  const getFilteredVideos = () => {
    if (aiSearchResults !== null) {
      return videos.filter(v => aiSearchResults.includes(v.id));
    }
    
    if (activeTab === 'home') {
      return videos.filter(v => !v.isParentVideo);
    }
    if (activeTab === 'saved') return videos.filter(v => savedIds.includes(v.id));
    if (activeTab === 'parents-videos') return videos.filter(v => v.isParentVideo);
    
    return videos.filter(v => v.category === activeTab);
  };

  const suggestedVideos = videos
    .filter(v => !v.isParentVideo && !getFilteredVideos().some(fv => fv.id === v.id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const handleGlobalClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const openTheaterMode = (video: Video) => {
    playClick();
    setActiveVideo(video);
    setIsFullWidth(false);
  };

  return (
    <div 
      className="min-h-screen flex text-white overflow-hidden relative"
      onClick={handleGlobalClick}
    >
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] text-6xl animate-float opacity-20">🧸</div>
        <div className="absolute bottom-[10%] right-[5%] text-8xl opacity-10 animate-float" style={{animationDelay: '2s'}}>🌈</div>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        categories={categories}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isDarkMode={settings.isDarkMode}
        showParentsTab={settings.showParentsTab}
      />

      <main className="flex-1 flex flex-col mt-20 lg:mt-0 relative z-10 overflow-hidden h-screen">
        
        <div className="p-4 lg:p-8 pb-0">
          <SearchBar 
            onSearch={handleAiSearch} 
            isSearching={isSearching} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-10 pt-4">
          <div className="max-w-[1400px] mx-auto">
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
              <div className="animate-fade-in space-y-16 pb-20">
                <section>
                  <header className="mb-10 text-center lg:text-right">
                    <div className="inline-block p-6 rounded-[2.5rem] glass-card border-white/30 reveal-highlight">
                      <h2 className="text-3xl lg:text-5xl font-black drop-shadow-lg text-white">
                        {aiSearchResults !== null ? 'نتائج البحث الذكي 🔍' : 
                         activeTab === 'home' ? 'عالم أحباب الله الممتع 🏠' : 
                         activeTab === 'parents-videos' ? 'فيديوهات الوالد 🧔' :
                         activeTab === 'saved' ? 'المحتوى المحفوظ ⭐' :
                         categories.find(c => c.id === activeTab)?.name || 'القسم المختار'}
                      </h2>
                    </div>
                  </header>

                  <div className={`${settings.theme === 'grid_modern' ? 'video-grid' : 'flex flex-col gap-10 lg:gap-16'}`}>
                    {getFilteredVideos().length > 0 ? (
                      getFilteredVideos().map(video => (
                        <VideoCard 
                          key={video.id} 
                          video={video} 
                          isSaved={savedIds.includes(video.id)}
                          onSave={() => handleSaveVideo(video.id)}
                          allVideos={videos}
                          onSelectVideo={openTheaterMode}
                          defaultQuality={settings.defaultQuality}
                        />
                      ))
                    ) : (
                      <div className="glass-card py-24 rounded-[3rem] text-center border-dashed border-white/20">
                        <p className="text-2xl opacity-60">لا يوجد محتوى هنا حالياً..🎈</p>
                      </div>
                    )}
                  </div>
                </section>

                {activeTab === 'home' && suggestedVideos.length > 0 && aiSearchResults === null && (
                  <section className="animate-fade-in">
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-4xl">🎁</span>
                      <h3 className="text-3xl font-black">اقتراحات رائعة لك</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {suggestedVideos.map(video => (
                        <VideoCard 
                          key={`suggested-${video.id}`} 
                          video={video} 
                          isSaved={savedIds.includes(video.id)}
                          onSave={() => handleSaveVideo(video.id)}
                          allVideos={videos}
                          onSelectVideo={openTheaterMode}
                          defaultQuality={settings.defaultQuality}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Optimized Theater Mode Modal */}
      {activeVideo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-10 bg-black/95 backdrop-blur-3xl animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div 
            className={`glass-card rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border border-white/20 shadow-[0_0_150px_rgba(0,0,0,0.9)] transition-all duration-700 relative flex flex-col
              ${isFullWidth ? 'w-full h-full rounded-none' : 'w-[98vw] md:w-[85vw] max-w-7xl aspect-video'}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Intelligent Control Bar */}
            <div className="absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 flex justify-between items-center z-50 transition-all">
               <div className="flex gap-3 md:gap-4">
                  <button 
                    onClick={() => setIsFullWidth(!isFullWidth)}
                    className="w-10 h-10 md:w-14 md:h-14 glass-card rounded-2xl flex items-center justify-center text-white text-xl hover:bg-white/20 border-white/30"
                    title={isFullWidth ? "عرض مريح" : "عرض كامل الشاشة"}
                  >
                    {isFullWidth ? '📉' : '📈'}
                  </button>
                  <button 
                    onClick={() => setActiveVideo(null)}
                    className="w-10 h-10 md:w-14 md:h-14 glass-card rounded-2xl flex items-center justify-center text-white text-xl hover:bg-red-500/40 border-white/30"
                    title="إغلاق"
                  >
                    ✕
                  </button>
               </div>
               
               <div className="glass-card px-4 md:px-8 py-2 md:py-3 rounded-2xl border-white/20 bg-black/40 backdrop-blur-lg hidden sm:block">
                  <span className="font-black text-sm md:text-lg truncate max-w-[200px] md:max-w-[400px] inline-block">{activeVideo.title}</span>
               </div>
            </div>

            <div className="flex-1 w-full relative">
              <iframe
                src={`${getEmbedUrl(activeVideo.url)}?vq=${settings.defaultQuality}&autoplay=1&rel=1&modestbranding=0&showinfo=1&enablejsapi=1&origin=${window.location.origin}`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 glass-nav flex items-center justify-between px-8 z-40 border-b border-white/10">
        <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }} className="text-3xl">☰</button>
        <span className="font-black text-2xl tracking-tight">أحباب الله</span>
        <div className="w-8"></div>
      </div>
    </div>
  );
};

export default App;
