
import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching, searchQuery, setSearchQuery }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Setup Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'ar-SA';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        onSearch(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onSearch, setSearchQuery]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("عذراً، متصفحك لا يدعم البحث الصوتي.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="w-full flex items-center gap-4 animate-fade-in relative z-20">
      <div className={`flex-1 flex items-center gap-3 p-2 pr-6 rounded-[2rem] glass-card border border-white/30 transition-all duration-500 ${isSearching ? 'ring-2 ring-sky-400' : ''}`}>
        <span className="text-2xl">🔍</span>
        <input 
          type="text" 
          placeholder="ابحث بالذكاء الاصطناعي.. مثلاً: قصص قطط" 
          className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-white/40"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        {searchQuery && (
          <button 
            onClick={() => { setSearchQuery(''); onSearch(''); }}
            className="p-2 hover:bg-white/10 rounded-full text-white/50"
          >
            ✕
          </button>
        )}

        <button 
          onClick={() => onSearch(searchQuery)}
          className={`px-6 py-2.5 bg-white text-sky-600 font-bold rounded-full shadow-lg transition-all active:scale-95 ${isSearching ? 'opacity-50' : 'hover:bg-sky-50'}`}
        >
          {isSearching ? 'يتم البحث..' : 'بحث ذكي'}
        </button>
      </div>

      <button 
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border border-white/20
          ${isListening ? 'bg-red-500 animate-pulse text-white scale-110 shadow-red-500/50' : 'bg-white/10 text-white hover:bg-white/20'}
        `}
      >
        <span className="text-2xl">{isListening ? '🛑' : '🎤'}</span>
      </button>
    </div>
  );
};

export default SearchBar;
