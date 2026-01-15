
import React, { useState, useEffect } from 'react';
import { Video, VideoQuality } from '../types';
import { getEmbedUrl } from '../services/videoService';

interface VideoCardProps {
  video: Video;
  isSaved: boolean;
  onSave: () => void;
  allVideos: Video[];
  onSelectVideo: (v: Video) => void;
  defaultQuality: VideoQuality;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isSaved, onSave, allVideos, onSelectVideo, defaultQuality }) => {
  const [currentQuality, setCurrentQuality] = useState<VideoQuality>(defaultQuality);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authReason, setAuthReason] = useState<'quality' | 'exit' | 'settings'>('quality');
  const [pendingQuality, setPendingQuality] = useState<VideoQuality | null>(null);
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setCurrentQuality(defaultQuality);
  }, [defaultQuality]);

  const qualities: { id: VideoQuality; label: string }[] = [
    { id: 'hd1080', label: '1080p' },
    { id: 'hd720', label: '720p' },
    { id: 'large', label: '480p' },
    { id: 'medium', label: '360p' },
    { id: 'small', label: '240p' },
    { id: 'tiny', label: '144p' },
    { id: 'auto', label: 'تلقائي' },
  ];

  const handleQualityRequest = (q: VideoQuality) => {
    setAuthReason('quality');
    setPendingQuality(q);
    setShowAuthModal(true);
    setPass('');
    setError(false);
  };

  const handleShieldClick = (e: React.MouseEvent, reason: 'exit' | 'settings') => {
    e.stopPropagation();
    setAuthReason(reason);
    setShowAuthModal(true);
    setPass('');
    setError(false);
  };

  const verifyPass = () => {
    if (pass === 'admin') {
      if (authReason === 'quality' && pendingQuality) {
        setCurrentQuality(pendingQuality);
      } else {
        alert('تم فك القفل مؤقتاً.. يمكنك الآن التحكم.');
      }
      setShowAuthModal(false);
      setPendingQuality(null);
    } else {
      setError(true);
    }
  };

  const suggestions = allVideos
    .filter(v => v.id !== video.id && !v.isParentVideo)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const embedBase = getEmbedUrl(video.url);
  const isInvalidChannel = embedBase === 'INVALID_CHANNEL_EMBED';
  
  const embedUrl = isInvalidChannel 
    ? '' 
    : `${embedBase}?vq=${currentQuality}&rel=1&showinfo=1&modestbranding=0&iv_load_policy=1&disablekb=0&enablejsapi=1&origin=${window.location.origin}`;

  const getYoutubeThumb = (url: string) => {
    const id = url.split('v=')[1]?.split('&')[0];
    if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    return 'https://via.placeholder.com/320x180?text=أحباب+الله';
  };

  return (
    <div className="w-full glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-3 md:p-8 border border-white/20 transition-all duration-500 hover:border-white/40 reveal-highlight">
      
      {/* Container with fixed Aspect Ratio 16:9 for consistent display */}
      <div className="relative w-full aspect-video rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl video-container mb-6 md:mb-10 bg-black/60 group">
        {isInvalidChannel ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-900/50">
            <span className="text-4xl md:text-6xl mb-4">⚠️</span>
            <h4 className="text-xl md:text-2xl font-black mb-2 leading-tight">عذراً، لا يمكن عرض القناة مباشرة</h4>
            <p className="text-sm opacity-60 max-w-md">يرجى إضافة رابط قائمة تشغيل (Playlist) لضمان عملها بشكل صحيح.</p>
          </div>
        ) : (
          <>
            <iframe
              src={embedUrl}
              className="w-full h-full"
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            ></iframe>

            {/* Smart Overlay: Clicking anywhere near center opens Theater Mode */}
            <div 
              onClick={() => onSelectVideo(video)}
              className="absolute inset-0 z-20 cursor-zoom-in group-hover:bg-white/5 transition-all flex items-center justify-center"
            >
                <div className="opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 bg-white/20 backdrop-blur-xl p-6 rounded-full border border-white/30 hidden md:flex items-center gap-3">
                   <span className="text-3xl">📺</span>
                   <span className="font-black">توسيط العرض</span>
                </div>
            </div>

            {/* Protective Shields (Parental Control areas) */}
            <div 
              onClick={(e) => handleShieldClick(e, 'settings')}
              className="absolute bottom-0 right-0 w-full h-12 z-30 cursor-pointer bg-transparent"
              title="منطقة محمية"
            />
            <div 
              onClick={(e) => handleShieldClick(e, 'exit')}
              className="absolute top-0 left-0 w-full h-12 z-30 cursor-pointer bg-transparent"
              title="منطقة محمية"
            />
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start justify-between px-2">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-2xl md:text-4xl font-black truncate max-w-full leading-tight">{video.title}</h3>
            {video.isParentVideo && <span className="shrink-0 bg-sky-500 text-white text-[9px] md:text-[11px] px-2 py-1 rounded-full font-bold shadow-md">🧔 والد</span>}
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
              <span className="text-xs font-bold opacity-40 ml-1">الدقة:</span>
              {qualities.slice(0, 4).map(q => (
                <button
                  key={q.id}
                  onClick={() => handleQualityRequest(q.id)}
                  className={`px-2.5 md:px-4 py-1.5 md:py-2.5 rounded-xl text-[9px] md:text-[12px] font-bold transition-all reveal-highlight ${currentQuality === q.id ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/5 border border-white/10'}`}
                >
                  {q.label}
                </button>
              ))}
            </div>
            
            <div className="h-8 w-px bg-white/10 mx-1 hidden md:block"></div>
            
            <button 
              onClick={onSave}
              className={`flex items-center gap-2 px-5 md:px-7 py-2 md:py-3 rounded-2xl font-black transition-all border-2 text-xs md:text-sm reveal-highlight
                ${isSaved 
                  ? 'bg-yellow-400 border-yellow-300 text-slate-900 shadow-xl scale-105' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
            >
              <span>{isSaved ? 'محفوظ' : 'حفظ'}</span>
              <span className="text-base md:text-xl">{isSaved ? '✅' : '⭐'}</span>
            </button>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-8 md:mt-12 pt-6 md:pt-10 border-t border-white/5">
          <h4 className="text-lg md:text-xl font-bold mb-5 flex items-center gap-3 px-2">
            <span>🍭</span> اخترنا لك بعناية
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {suggestions.map(v => (
              <button
                key={`suggest-${v.id}`}
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onSelectVideo(v); }}
                className="glass-card p-3 md:p-5 rounded-[1.5rem] md:rounded-[2.2rem] text-right transition-all hover:scale-[1.04] border border-white/5 group bg-white/5 hover:bg-white/10 reveal-highlight"
              >
                <div className="aspect-video bg-white/5 rounded-xl md:rounded-2xl mb-3 overflow-hidden shadow-lg border border-white/5">
                  <img 
                    src={getYoutubeThumb(v.url)} 
                    alt={v.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-[9px] md:text-[11px] font-black truncate tracking-tight">{v.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-6" onClick={(e) => e.stopPropagation()}>
          <div className="glass-card p-10 md:p-14 rounded-[3rem] w-full max-w-sm text-center border-white/30 animate-scale-up shadow-[0_0_60px_rgba(0,0,0,0.6)]">
            <div className="text-5xl md:text-7xl mb-6">{authReason === 'exit' ? '🛡️' : '🔐'}</div>
            <h3 className="text-xl md:text-2xl font-black mb-3">
              {authReason === 'exit' ? 'حماية النظام' : 'إذن الوالدين'}
            </h3>
            <p className="text-xs md:text-sm opacity-50 mb-8 leading-relaxed">
              يرجى إدخال رمز المسؤول للتحكم في الإعدادات.
            </p>
            
            <input 
              type="password" 
              placeholder="admin"
              className="w-full bg-white/10 border border-white/20 p-4 md:p-5 rounded-2xl mb-5 text-center text-white outline-none focus:bg-white/20 text-lg tracking-widest"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && verifyPass()}
            />
            {error && <p className="text-red-400 text-[10px] md:text-xs mb-4 font-black">الرمز غير صحيح!</p>}
            
            <div className="flex gap-4">
              <button onClick={verifyPass} className="flex-1 bg-white text-sky-600 font-black py-4 rounded-2xl shadow-xl hover:bg-sky-50 transition-all">دخول</button>
              <button onClick={() => setShowAuthModal(false)} className="flex-1 bg-white/10 font-bold py-4 rounded-2xl hover:bg-white/20 transition-all text-white">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
