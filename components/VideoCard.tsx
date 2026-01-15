
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

  const handleError = () => {
    setHasError(true);
    onReportError("فشل تحميل الفيديو من الرابط المزود");
  };

  return (
    <div className={`
      group overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl shadow-sky-900/5 
      border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
      ${video.isBroken ? 'border-red-400' : 'border-transparent'}
    `}>
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden">
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-4xl mb-2">😵</span>
            <p className="text-sm font-medium text-red-500">عذراً، هذا الفيديو غير متاح حالياً</p>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onError={handleError}
          ></iframe>
        )}
      </div>

      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1 line-clamp-2 dark:text-white leading-tight">
            {video.title}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
            {video.category}
          </span>
        </div>

        <button
          onClick={onSave}
          className={`
            p-3 rounded-2xl transition-all active:scale-90
            ${isSaved 
              ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/30' 
              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200'}
          `}
          title={isSaved ? "إزالة من المحفوظات" : "حفظ الفيديو"}
        >
          <span className="text-xl leading-none">⭐</span>
        </button>
      </div>

      {video.isBroken && (
        <div className="bg-red-500 text-white text-[10px] py-1 text-center font-bold">
          تم الإبلاغ عن مشكلة في هذا الرابط
        </div>
      )}
    </div>
  );
};

export default VideoCard;
