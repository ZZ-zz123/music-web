import { useState, useEffect } from 'react';
import { songApi, singerApi, getFullBackendUrl } from '../services/api';
import { Song } from '../types';

// 创建一个安全的Base64编码函数，支持Unicode字符
const safeBase64Encode = (str: string): string => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
};

// 生成默认的歌曲封面占位图
const getDefaultCoverUrl = (): string => {
  const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="300" height="300" fill="#404040"/>
    <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="24">Music</text>
  </svg>`;
  return `data:image/svg+xml;base64,${safeBase64Encode(svg)}`;
};

// 获取真实歌曲数据的Hook
export const useRealSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await songApi.getHotSongs(50);
        console.log('热门歌曲API响应:', response);
        console.log('歌曲数量:', Array.isArray(response) ? response.length : 0);
        
        // 转换后端数据格式为前端格式
        const transformedSongs: Song[] = Array.isArray(response) ? response.map((song: any) => ({
          id: song.id.toString(),
          title: song.name,
          artist: song.singerName || '未知歌手',
          album: song.albumName || '未知专辑',
          duration: song.duration || 0,
          coverUrl: song.coverUrl ? getFullBackendUrl(song.coverUrl) : getDefaultCoverUrl(),
          audioUrl: getFullBackendUrl(song.audioUrl),
          dateAdded: song.createTime ? song.createTime.split(' ')[0] : undefined,
          lyrics: song.lyric || undefined, // 添加歌词字段
        })) : [];

        setSongs(transformedSongs);
        setError(null);
      } catch (err) {
        console.error('获取歌曲数据失败:', err);
        setError('获取歌曲数据失败');
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return { songs, loading, error };
};

// 获取搜索结果的Hook
export const useSearchSongs = (keyword: string) => {
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    const searchSongs = async () => {
      try {
        setLoading(true);
        const response = await songApi.searchSongs(keyword, 20);
        
        const transformedSongs: Song[] = response.map((song: any) => ({
          id: song.id.toString(),
          title: song.name,
          artist: song.singerName || '未知歌手',
          album: song.albumName || '未知专辑',
          duration: song.duration || 0,
          coverUrl: song.coverUrl ? getFullBackendUrl(song.coverUrl) : getDefaultCoverUrl(),
          audioUrl: getFullBackendUrl(song.audioUrl),
          lyrics: song.lyric || undefined, // 添加歌词字段
        }));

        setResults(transformedSongs);
      } catch (err) {
        console.error('搜索失败:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    // 防抖
    const timer = setTimeout(searchSongs, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  return { results, loading };
};

// 根据分类获取歌曲的Hook
export const useGenreSongs = (genre: string) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!genre) return;

    const fetchGenreSongs = async () => {
      try {
        setLoading(true);
        const response = await songApi.getSongsByGenre(genre, 20);
        
        const transformedSongs: Song[] = response.map((song: any) => ({
          id: song.id.toString(),
          title: song.name,
          artist: song.singerName || '未知歌手',
          album: song.albumName || '未知专辑',
          duration: song.duration || 0,
          coverUrl: song.coverUrl ? getFullBackendUrl(song.coverUrl) : getDefaultCoverUrl(),
          audioUrl: getFullBackendUrl(song.audioUrl),
          dateAdded: song.createTime ? song.createTime.split(' ')[0] : undefined,
          lyrics: song.lyric || undefined, // 添加歌词字段
        }));

        setSongs(transformedSongs);
        setError(null);
      } catch (err) {
        console.error('获取分类歌曲失败:', err);
        setError('获取分类歌曲失败');
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreSongs();
  }, [genre]);

  return { songs, loading, error };
};

// 获取推荐歌曲的Hook
export const useRecommendSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendSongs = async () => {
      try {
        setLoading(true);
        const response = await songApi.getRecommendSongs(undefined, 30);
        
        const transformedSongs: Song[] = response.map((song: any) => ({
          id: song.id.toString(),
          title: song.name,
          artist: song.singerName || '未知歌手',
          album: song.albumName || '未知专辑',
          duration: song.duration || 0,
          coverUrl: song.coverUrl ? getFullBackendUrl(song.coverUrl) : getDefaultCoverUrl(),
          audioUrl: getFullBackendUrl(song.audioUrl),
          lyrics: song.lyric || undefined, // 添加歌词字段
        }));

        setSongs(transformedSongs);
        setError(null);
      } catch (err) {
        console.error('获取推荐歌曲失败:', err);
        setError('获取推荐歌曲失败');
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendSongs();
  }, []);

  return { songs, loading, error };
};
