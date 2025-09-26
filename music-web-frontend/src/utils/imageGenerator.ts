// 图片生成工具 - 为歌曲、歌手、歌单生成美观的SVG图片

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

// 预定义的颜色方案
const colorSchemes: ColorScheme[] = [
  { primary: '#667eea', secondary: '#764ba2', accent: '#f093fb' },
  { primary: '#f093fb', secondary: '#f5576c', accent: '#4facfe' },
  { primary: '#43e97b', secondary: '#38f9d7', accent: '#667eea' },
  { primary: '#fa709a', secondary: '#fee140', accent: '#764ba2' },
  { primary: '#a8edea', secondary: '#fed6e3', accent: '#f093fb' },
  { primary: '#ffecd2', secondary: '#fcb69f', accent: '#667eea' },
  { primary: '#ff9a9e', secondary: '#fecfef', accent: '#43e97b' },
  { primary: '#4facfe', secondary: '#00f2fe', accent: '#f5576c' },
  { primary: '#ff6b6b', secondary: '#4ecdc4', accent: '#45b7d1' },
  { primary: '#96ceb4', secondary: '#ffeaa7', accent: '#dda0dd' },
];

// 为字符串生成一致的颜色方案索引
function getColorSchemeIndex(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % colorSchemes.length;
}

// 生成歌手头像
export function generateSingerAvatar(singerName: string, size = 300): string {
  const colorScheme = colorSchemes[getColorSchemeIndex(singerName)];
  const initials = singerName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${singerName}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorScheme.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colorScheme.secondary};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow-${singerName}">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
        </filter>
      </defs>
      
      <!-- 背景圆形 -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="url(#grad-${singerName})" filter="url(#shadow-${singerName})"/>
      
      <!-- 装饰性元素 -->
      <circle cx="${size*0.8}" cy="${size*0.2}" r="${size*0.1}" fill="rgba(255,255,255,0.2)"/>
      <circle cx="${size*0.2}" cy="${size*0.8}" r="${size*0.08}" fill="rgba(255,255,255,0.15)"/>
      <circle cx="${size*0.85}" cy="${size*0.85}" r="${size*0.06}" fill="rgba(255,255,255,0.1)"/>
      
      <!-- 歌手名称缩写 -->
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" 
            fill="white" font-family="Arial, sans-serif" 
            font-size="${size*0.25}" font-weight="bold" 
            text-shadow="0 2px 4px rgba(0,0,0,0.3)">
        ${initials}
      </text>
      
      <!-- 音乐图标 -->
      <text x="50%" y="${size*0.75}" text-anchor="middle" dy="0.3em" 
            fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" 
            font-size="${size*0.08}">
        ♪
      </text>
    </svg>
  `;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// 生成歌曲封面
export function generateSongCover(songName: string, artistName: string, size = 300): string {
  const colorScheme = colorSchemes[getColorSchemeIndex(songName + artistName)];
  const songInitial = songName[0]?.toUpperCase() || '♪';
  
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="song-grad-${songName}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorScheme.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colorScheme.accent};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${colorScheme.secondary};stop-opacity:1" />
        </linearGradient>
        <filter id="glow-${songName}">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- 背景 -->
      <rect width="${size}" height="${size}" fill="url(#song-grad-${songName})"/>
      
      <!-- 几何装饰 -->
      <circle cx="${size*0.2}" cy="${size*0.2}" r="${size*0.15}" fill="rgba(255,255,255,0.1)"/>
      <circle cx="${size*0.8}" cy="${size*0.3}" r="${size*0.12}" fill="rgba(255,255,255,0.08)"/>
      <circle cx="${size*0.7}" cy="${size*0.8}" r="${size*0.1}" fill="rgba(255,255,255,0.12)"/>
      <rect x="${size*0.1}" y="${size*0.6}" width="${size*0.3}" height="${size*0.25}" 
            fill="rgba(255,255,255,0.06)" rx="${size*0.02}"/>
      
      <!-- 中央图标 -->
      <circle cx="${size/2}" cy="${size*0.4}" r="${size*0.18}" fill="rgba(255,255,255,0.2)" filter="url(#glow-${songName})"/>
      <text x="50%" y="${size*0.4}" text-anchor="middle" dy="0.3em" 
            fill="white" font-family="Arial, sans-serif" 
            font-size="${size*0.15}" font-weight="bold">
        ${songInitial}
      </text>
      
      <!-- 歌曲名 -->
      <text x="50%" y="${size*0.7}" text-anchor="middle" dy="0.3em" 
            fill="white" font-family="Arial, sans-serif" 
            font-size="${Math.min(size*0.08, size*0.5/songName.length)}" font-weight="bold"
            text-shadow="0 1px 2px rgba(0,0,0,0.5)">
        ${songName.length > 12 ? songName.substring(0, 12) + '...' : songName}
      </text>
      
      <!-- 歌手名 -->
      <text x="50%" y="${size*0.8}" text-anchor="middle" dy="0.3em" 
            fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" 
            font-size="${Math.min(size*0.06, size*0.4/artistName.length)}"
            text-shadow="0 1px 2px rgba(0,0,0,0.5)">
        ${artistName.length > 15 ? artistName.substring(0, 15) + '...' : artistName}
      </text>
    </svg>
  `;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// 生成歌单封面
export function generatePlaylistCover(playlistName: string, description: string = '', size = 300): string {
  const colorScheme = colorSchemes[getColorSchemeIndex(playlistName)];
  
  // 根据歌单类型选择图标
  let icon = '🎵';
  const lowerName = playlistName.toLowerCase();
  if (lowerName.includes('心') || lowerName.includes('喜欢') || lowerName.includes('love')) icon = '❤️';
  else if (lowerName.includes('民谣') || lowerName.includes('folk')) icon = '🍃';
  else if (lowerName.includes('摇滚') || lowerName.includes('rock')) icon = '🎸';
  else if (lowerName.includes('韩') || lowerName.includes('k-pop') || lowerName.includes('kpop')) icon = '🇰🇷';
  else if (lowerName.includes('欧美') || lowerName.includes('pop')) icon = '🌍';
  else if (lowerName.includes('经典') || lowerName.includes('老歌')) icon = '💎';
  else if (lowerName.includes('新歌') || lowerName.includes('最新')) icon = '✨';
  else if (lowerName.includes('热门') || lowerName.includes('排行')) icon = '🔥';
  else if (lowerName.includes('安静') || lowerName.includes('轻音乐')) icon = '🌙';
  else if (lowerName.includes('运动') || lowerName.includes('健身')) icon = '💪';

  // 清理歌单名称，确保在SVG ID中使用时安全
  const safePlaylistName = playlistName.replace(/[^a-zA-Z0-9]/g, '');
  
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="playlist-grad-${safePlaylistName}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorScheme.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colorScheme.secondary};stop-opacity:1" />
        </linearGradient>
        <radialGradient id="radial-${safePlaylistName}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.2);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0);stop-opacity:0" />
        </radialGradient>
      </defs>
      
      <!-- 背景 -->
      <rect width="${size}" height="${size}" fill="url(#playlist-grad-${safePlaylistName})"/>
      
      <!-- 放射性装饰 -->
      <circle cx="${size/2}" cy="${size/2}" r="${size*0.4}" fill="url(#radial-${safePlaylistName})"/>
      
      <!-- 装饰性方块 -->
      <rect x="${size*0.05}" y="${size*0.05}" width="${size*0.2}" height="${size*0.2}" 
            fill="rgba(255,255,255,0.1)" rx="${size*0.02}"/>
      <rect x="${size*0.75}" y="${size*0.75}" width="${size*0.2}" height="${size*0.2}" 
            fill="rgba(255,255,255,0.08)" rx="${size*0.02}"/>
      <rect x="${size*0.8}" y="${size*0.1}" width="${size*0.15}" height="${size*0.15}" 
            fill="rgba(255,255,255,0.12)" rx="${size*0.015}"/>
      
      <!-- 中心图标 -->
      <circle cx="${size/2}" cy="${size*0.4}" r="${size*0.12}" fill="rgba(255,255,255,0.3)"/>
      <text x="50%" y="${size*0.4}" text-anchor="middle" dy="0.3em" 
            font-family="Arial, sans-serif" font-size="${size*0.1}">
        ${icon}
      </text>
      
      <!-- 歌单名 -->
      <text x="50%" y="${size*0.65}" text-anchor="middle" dy="0.3em" 
            fill="white" font-family="Arial, sans-serif" 
            font-size="${Math.min(size*0.08, size*0.6/playlistName.length)}" font-weight="bold"
            text-shadow="0 2px 4px rgba(0,0,0,0.5)">
        ${playlistName.length > 10 ? playlistName.substring(0, 10) + '...' : playlistName}
      </text>
      
      <!-- 描述 -->
      ${description ? `
      <text x="50%" y="${size*0.8}" text-anchor="middle" dy="0.3em" 
            fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" 
            font-size="${size*0.05}"
            text-shadow="0 1px 2px rgba(0,0,0,0.5)">
        ${description.length > 20 ? description.substring(0, 20) + '...' : description}
      </text>
      ` : ''}
    </svg>
  `;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// 生成专辑封面
export function generateAlbumCover(albumName: string, artistName: string, size = 300): string {
  const colorScheme = colorSchemes[getColorSchemeIndex(albumName + artistName)];
  
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="album-grad-${albumName}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorScheme.primary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colorScheme.secondary};stop-opacity:1" />
        </linearGradient>
        <pattern id="vinyl-${albumName}" patternUnits="userSpaceOnUse" width="20" height="20">
          <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        </pattern>
      </defs>
      
      <!-- 背景 -->
      <rect width="${size}" height="${size}" fill="url(#album-grad-${albumName})"/>
      
      <!-- 黑胶唱片效果 -->
      <circle cx="${size/2}" cy="${size/2}" r="${size*0.4}" fill="url(#vinyl-${albumName})"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size*0.35}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size*0.25}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size*0.15}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      
      <!-- 中心孔 -->
      <circle cx="${size/2}" cy="${size/2}" r="${size*0.05}" fill="rgba(0,0,0,0.3)"/>
      
      <!-- 专辑名 -->
      <text x="50%" y="${size*0.85}" text-anchor="middle" dy="0.3em" 
            fill="white" font-family="Arial, sans-serif" 
            font-size="${Math.min(size*0.08, size*0.5/albumName.length)}" font-weight="bold"
            text-shadow="0 2px 4px rgba(0,0,0,0.7)">
        ${albumName.length > 12 ? albumName.substring(0, 12) + '...' : albumName}
      </text>
      
      <!-- 艺术家名 -->
      <text x="50%" y="${size*0.95}" text-anchor="middle" dy="0.3em" 
            fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" 
            font-size="${Math.min(size*0.06, size*0.4/artistName.length)}"
            text-shadow="0 1px 2px rgba(0,0,0,0.7)">
        ${artistName.length > 15 ? artistName.substring(0, 15) + '...' : artistName}
      </text>
    </svg>
  `;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
