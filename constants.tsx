
import React from 'react';

export const DEFAULT_CATEGORIES = [
  { id: 'stories', name: 'قصص الأطفال', icon: '📚', color: 'bg-pink-100 text-pink-600' },
  { id: 'cartoon', name: 'الكرتون', icon: '🎬', color: 'bg-blue-100 text-blue-600' },
  { id: 'educational', name: 'القسم التعليمي', icon: '💡', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'songs', name: 'أغاني الأطفال', icon: '🎵', color: 'bg-green-100 text-green-600' },
];

export const CLICK_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

export const YouTubeIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
  </svg>
);
