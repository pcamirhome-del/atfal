
export type CategoryType = 'home' | 'stories' | 'cartoon' | 'educational' | 'songs' | 'saved' | 'settings' | 'admin' | 'parents-videos';
export type AppTheme = 'default' | 'forest' | 'candy' | 'galaxy' | 'neumorphic' | 'retro' | 'futuristic' | 'corporate' | 'creative' | 'skeuomorphic' | 'aero' | 'frosted' | 'transparent' | 'vibrant' | 'ios' | 'advanced_glass' | 'grid_modern';
export type VideoQuality = 'auto' | 'hd1080' | 'hd720' | 'large' | 'medium' | 'small' | 'tiny';

export interface Video {
  id: string;
  title: string;
  url: string;
  category: string;
  isBroken?: boolean;
  timestamp: number;
  isChannel?: boolean;
  isParentVideo?: boolean;
}

export interface AppSettings {
  isDarkMode: boolean;
  soundEnabled: boolean;
  theme: AppTheme;
  defaultQuality: VideoQuality;
  showParentsTab: boolean;
}

export interface HealthCheckReport {
  videoId: string;
  videoTitle: string;
  error: string;
}
