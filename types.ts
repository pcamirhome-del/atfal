
export type CategoryType = 'home' | 'stories' | 'cartoon' | 'educational' | 'songs' | 'saved' | 'settings' | 'admin';
export type AppTheme = 'default' | 'forest' | 'candy' | 'galaxy';

export interface Video {
  id: string;
  title: string;
  url: string;
  category: string;
  isBroken?: boolean;
  timestamp: number;
}

export interface AppSettings {
  isDarkMode: boolean;
  soundEnabled: boolean;
  theme: AppTheme;
}

export interface HealthCheckReport {
  videoId: string;
  videoTitle: string;
  error: string;
}
