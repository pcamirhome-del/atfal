
export type CategoryType = 'home' | 'stories' | 'cartoon' | 'educational' | 'songs' | 'saved' | 'settings' | 'admin';
export type AppTheme = 'default' | 'forest' | 'candy' | 'galaxy';
export type VideoQuality = 'auto' | 'hd1080' | 'hd720' | 'large' | 'medium' | 'small' | 'tiny';

export interface Video {
  id: string;
  title: string;
  url: string;
  category: string;
  isBroken?: boolean;
  timestamp: number;
  isChannel?: boolean;
}

export interface AppSettings {
  isDarkMode: boolean;
  soundEnabled: boolean;
  theme: AppTheme;
  defaultQuality: VideoQuality;
}

export interface HealthCheckReport {
  videoId: string;
  videoTitle: string;
  error: string;
}
