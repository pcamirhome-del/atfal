
export const getEmbedUrl = (url: string): string => {
  if (!url) return '';

  // 1. YouTube Video Logic
  const videoRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const videoMatch = url.match(videoRegex);
  if (videoMatch && videoMatch[1]) {
    return `https://www.youtube.com/embed/${videoMatch[1]}`;
  }

  // 2. YouTube Playlist Logic (Better for "Channels")
  // YouTube doesn't allow embedding channel pages directly (@handle).
  // Playlists work perfectly and are the best way to show "all videos" from a source.
  const playlistRegex = /[?&]list=([^#&?]+)/;
  const playlistMatch = url.match(playlistRegex);
  if (playlistMatch && playlistMatch[1]) {
    return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}`;
  }

  // 3. Prevent "Refused to connect" for standard channel URLs
  if (url.includes('youtube.com/@') || url.includes('youtube.com/channel/') || url.includes('youtube.com/user/')) {
    // Return a special flag or a help URL. 
    // Since we can't embed the site, we return a blank to avoid the error and handle it in the UI.
    return 'INVALID_CHANNEL_EMBED';
  }

  // Fallback
  return url;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
