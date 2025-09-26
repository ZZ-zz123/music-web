// 音乐相关类型定义
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  dateAdded?: string;
  lyrics?: string; // 歌词内容
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: Song[];
  createdBy: string;
  isPublic: boolean;
  genre?: string;
}

export interface MixCard {
  id: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  type: 'mix' | 'playlist' | 'album' | 'genre-mix' | 'artist-mix' | 'recently-played' | 'continue-listening' | 'radio' | 'hits';
  genre?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  displayName: string;
}

// 评论相关类型
export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  createTime: string;
  likeCount: number;
  isLiked: boolean;
  replies?: Comment[];
  parentId?: string;
}

export interface CommentRequest {
  targetId: string;
  targetType: 'song' | 'playlist';
  content: string;
  parentId?: string;
}

// 播放模式枚举
export enum PlayMode {
  SEQUENTIAL = 'sequential', // 顺序播放
  SHUFFLE = 'shuffle',       // 随机播放
  REPEAT_ONE = 'repeat_one', // 单曲循环
  REPEAT_ALL = 'repeat_all'  // 列表循环
}

// Redux 状态类型
export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  previousVolume: number; // 静音前的音量
  currentTime: number;
  duration: number;
  playlist: Song[];
  currentIndex: number;
  playMode: PlayMode;
  showPlaylist: boolean;
  isFullscreen: boolean;
}

export interface AppState {
  user: User | null;
  player: PlayerState;
  playlists: Playlist[];
  recentlyPlayed: MixCard[];
}
