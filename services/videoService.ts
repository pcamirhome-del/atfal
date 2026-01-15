
export const getEmbedUrl = (url: string): string => {
  if (!url) return '';

  // YouTube logic
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  // Fallback for direct links (assumes they work in an iframe or direct player)
  return url;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
