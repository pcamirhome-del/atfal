
import React, { useState } from 'react';
import { Video } from '../types';
import { getEmbedUrl } from '../services/videoService';

interface VideoCardProps {
  video: Video;
  isSaved: boolean;
  onSave: () => void;
  onReportError: (error: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isSaved, onSave, onReportError }) => {
  const [hasError, setHasError] = useState(false);
  const embedUrl = getEmbedUrl(video.url);

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden group transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl border border-white/20">
      <div className="relative aspect-video">
        {!hasError ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            title={video.title}
            frameBorder="0"
            allowFullScreen
            onError={() => setHasError(true)}
          ></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black/20">
            <span className="text-4xl mb-2">🎈</span>
            <p className="text-sm">هذا الفيديو يأخذ استراحة!</p>
          </div>
        )}
      </div>

      <div className="p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xl mb-1 truncate w-48">{video.title}</h3>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full uppercase font-bold tracking-tighter">
            {video.category}
          </span>
        </div>
        
        <button
          onClick={onSave}
          className={`
            p-4 rounded-2xl transition-all duration-300
            ${isSaved ? 'bg-yellow-400 text-slate-900 shadow-lg' : 'bg-white/10 hover:bg-white/30'}
          `}
        >
          <span className="text-xl">⭐</span>
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
