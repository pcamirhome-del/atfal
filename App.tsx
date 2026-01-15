
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
    defaultQuality: 'hd720'
  });
  const [healthReports, setHealthReports] = useState<HealthCheckReport[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSearchResults, setAiSearchResults] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

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
    if (storedSettings) setSettings(JSON.parse(storedSettings));
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
      // Fallback simple search
      const fallback = videos
        .filter(v => v.title.toLowerCase().includes(query.toLowerCase()))
        .map(v => v.id);
      setAiSearchResults(fallback);
    } finally {
      setIsSearching(false);
    }
  };

  const getFilteredVideos = () => {
    let baseVideos = videos;
    
    if (aiSearchResults !== null) {
      return videos.filter(v => aiSearchResults.includes(v.id));
    }
    
    if (activeTab === 'home') baseVideos = videos;
    else if (activeTab === 'saved') baseVideos = videos.filter(v => savedIds.includes(v.id));
    else baseVideos = videos.filter(v => v.category === activeTab);

    return baseVideos;
  };

  const suggestedVideos = videos
    .filter(v => !getFilteredVideos().some(fv => fv.id === v.id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className="min-h-screen flex text-white overflow-hidden relative" onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
      
      {/* Background Decor */}
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
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col mt-20 lg:mt-0 relative z-10 overflow-hidden h-screen">
        
        {/* Top Header with AI Search */}
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
                {/* Main Results */}
                <section>
                  <header className="mb-10 text-center lg:text-right">
                    <div className="inline-block p-6 rounded-[2.5rem] glass-card border-white/30">
                      <h2 className="text-3xl lg:text-5xl font-black drop-shadow-lg text-white">
                        {aiSearchResults !== null ? 'نتائج البحث الذكي 🔍' : 
                         activeTab === 'home' ? 'عالم أحباب الله الممتع 🏠' : 
                         categories.find(c => c.id === activeTab)?.name || 'القسم المختار'}
                      </h2>
                    </div>
                  </header>

                  <div className="flex flex-col gap-16">
                    {getFilteredVideos().length > 0 ? (
                      getFilteredVideos().map(video => (
                        <VideoCard 
                          key={video.id} 
                          video={video} 
                          isSaved={savedIds.includes(video.id)}
                          onSave={() => handleSaveVideo(video.id)}
                          allVideos={videos}
                          onSelectVideo={(v) => { /* Selection Logic */ }}
                          defaultQuality={settings.defaultQuality}
                        />
                      ))
                    ) : (
                      <div className="glass-card py-24 rounded-[3rem] text-center border-dashed border-white/20">
                        <p className="text-2xl opacity-60">لم نجد فيديوهات هنا حالياً.. جرب البحث! 🎈</p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Home Page Suggestions */}
                {activeTab === 'home' && suggestedVideos.length > 0 && aiSearchResults === null && (
                  <section className="animate-fade-in">
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-4xl">🎁</span>
                      <h3 className="text-3xl font-black">اقتراحات رائعة لك</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {suggestedVideos.map(video => (
                        <VideoCard 
                          key={`suggested-${video.id}`} 
                          video={video} 
                          isSaved={savedIds.includes(video.id)}
                          onSave={() => handleSaveVideo(video.id)}
                          allVideos={videos}
                          onSelectVideo={() => {}}
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

      {/* Mobile Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 glass-nav flex items-center justify-between px-8 z-40 border-b border-white/10">
        <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(true); }} className="text-3xl">☰</button>
        <span className="font-black text-2xl tracking-tight">أحباب الله</span>
        <div className="w-8"></div>
      </div>
    </div>
  );
};

export default App;
