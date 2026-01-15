
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
  
  // Updated embedUrl: rel=1 to allow suggested videos from YouTube
  const embedUrl = isInvalidChannel 
    ? '' 
    : `${embedBase}?vq=${currentQuality}&rel=1&showinfo=1&modestbranding=0&iv_load_policy=1&disablekb=0&enablejsapi=1&origin=${window.location.origin}`;

  const getYoutubeThumb = (url: string) => {
    const id = url.split('v=')[1]?.split('&')[0];
    if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    return 'https://via.placeholder.com/320x180?text=أحباب+الله';
  };

  return (
    <div className="w-full glass-card rounded-[3rem] p-4 lg:p-8 border border-white/20 transition-all duration-500 hover:border-white/40 reveal-highlight">
      <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl video-container mb-8 bg-black/60 group">
        {isInvalidChannel ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-10 bg-slate-900/50">
            <span className="text-6xl mb-4">⚠️</span>
            <h4 className="text-2xl font-black mb-2">عذراً، لا يمكن عرض القناة مباشرة</h4>
            <p className="opacity-60 max-w-md">يرجى إضافة رابط قائمة تشغيل (Playlist) لضمان عملها بشكل صحيح.</p>
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

            {/* Overlay for Theater Mode */}
            <button 
              onClick={() => onSelectVideo(video)}
              className="absolute top-4 right-4 z-40 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md text-white p-3 rounded-2xl border border-white/20 hover:scale-110 active:scale-95 flex items-center gap-2"
              title="توسيط الفيديو"
            >
              <span className="text-sm font-bold">توسيط العرض</span>
              <span>📺</span>
            </button>

            <div 
              onClick={(e) => handleShieldClick(e, 'settings')}
              className="absolute bottom-0 right-0 w-full h-14 z-30 cursor-pointer bg-transparent"
              title="منطقة محمية - إعدادات يوتيوب"
            />
            
            <div 
              onClick={(e) => handleShieldClick(e, 'exit')}
              className="absolute top-0 left-0 w-full h-16 z-30 cursor-pointer bg-transparent"
              title="منطقة محمية - الخروج من التطبيق"
            />
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-3xl lg:text-4xl font-black truncate max-w-[80%]">{video.title}</h3>
            {video.isParentVideo && <span className="bg-sky-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-md">🧔 فيديو الوالد</span>}
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold opacity-50 ml-2">الجودة:</span>
              {qualities.map(q => (
                <button
                  key={q.id}
                  onClick={() => handleQualityRequest(q.id)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all reveal-highlight ${currentQuality === q.id ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/5 hover:bg-white/20 border border-white/10'}`}
                >
                  {q.label}
                </button>
              ))}
            </div>
            
            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>
            
            <button 
              onClick={onSave}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all border-2 reveal-highlight
                ${isSaved 
                  ? 'bg-yellow-400 border-yellow-300 text-slate-900 shadow-xl scale-105' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
            >
              <span>{isSaved ? 'تم الحفظ' : 'حفظ الفيدو'}</span>
              <span className="text-lg">{isSaved ? '✅' : '⭐'}</span>
            </button>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-12 pt-8 border-t border-white/10">
          <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span>🍪</span> اقتراحات ذكية لك
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {suggestions.map(v => (
              <button
                key={`suggest-${v.id}`}
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); onSelectVideo(v); }}
                className="glass-card p-4 rounded-[2rem] text-right transition-all hover:scale-[1.05] border border-white/5 group bg-white/5 hover:bg-white/10 reveal-highlight"
              >
                <div className="aspect-video bg-white/5 rounded-2xl mb-3 overflow-hidden shadow-lg border border-white/10">
                  <img 
                    src={getYoutubeThumb(v.url)} 
                    alt={v.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-[10px] font-bold truncate tracking-tight">{v.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-xl p-6" onClick={(e) => e.stopPropagation()}>
          <div className="glass-card p-12 rounded-[3.5rem] w-full max-w-sm text-center border-white/30 animate-scale-up shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="text-6xl mb-6">{authReason === 'exit' ? '🛡️' : '🔐'}</div>
            <h3 className="text-2xl font-black mb-2">
              {authReason === 'exit' ? 'حماية أحباب الله' : 'استأذن من والديك'}
            </h3>
            <p className="text-sm opacity-60 mb-8 leading-relaxed">
              أدخل رمز المسؤول للمتابعة.
            </p>
            
            <input 
              type="password" 
              placeholder="admin"
              className="w-full bg-white/10 border border-white/20 p-5 rounded-[2rem] mb-4 text-center text-white outline-none focus:bg-white/20 text-lg tracking-widest"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && verifyPass()}
            />
            {error && <p className="text-red-400 text-xs mb-4 font-bold">خطأ!</p>}
            
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

export default VideoCard;
