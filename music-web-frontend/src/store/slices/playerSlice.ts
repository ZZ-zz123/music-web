import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState, Song, PlayMode } from '../../types';

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  isMuted: false,
  previousVolume: 0.8,
  currentTime: 0,
  duration: 0,
  playlist: [],
  currentIndex: -1,
  playMode: PlayMode.SEQUENTIAL,
  showPlaylist: false,
  isFullscreen: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setPlaylist: (state, action: PayloadAction<Song[]>) => {
      state.playlist = action.payload;
    },
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    setPlayMode: (state, action: PayloadAction<PlayMode>) => {
      state.playMode = action.payload;
    },
    toggleMute: (state) => {
      if (state.isMuted) {
        state.isMuted = false;
        state.volume = state.previousVolume;
      } else {
        state.isMuted = true;
        state.previousVolume = state.volume;
        state.volume = 0;
      }
    },
    setShowPlaylist: (state, action: PayloadAction<boolean>) => {
      state.showPlaylist = action.payload;
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen;
    },
    playNext: (state) => {
      const { playlist, currentIndex, playMode } = state;
      
      if (playlist.length === 0) return;
      
      let nextIndex = currentIndex;
      
      switch (playMode) {
        case PlayMode.SEQUENTIAL:
          if (currentIndex < playlist.length - 1) {
            nextIndex = currentIndex + 1;
          }
          break;
        case PlayMode.SHUFFLE:
          // 随机播放：生成不同于当前的随机索引
          if (playlist.length > 1) {
            do {
              nextIndex = Math.floor(Math.random() * playlist.length);
            } while (nextIndex === currentIndex);
          }
          break;
        case PlayMode.REPEAT_ONE:
          // 单曲循环：保持当前索引
          nextIndex = currentIndex;
          break;
        case PlayMode.REPEAT_ALL:
          // 列表循环：到末尾时回到开头
          nextIndex = (currentIndex + 1) % playlist.length;
          break;
      }
      
      if (nextIndex !== currentIndex || playMode === PlayMode.REPEAT_ONE) {
        state.currentIndex = nextIndex;
        state.currentSong = playlist[nextIndex];
      }
    },
    playPrevious: (state) => {
      const { playlist, currentIndex, playMode } = state;
      
      if (playlist.length === 0) return;
      
      let prevIndex = currentIndex;
      
      switch (playMode) {
        case PlayMode.SEQUENTIAL:
          if (currentIndex > 0) {
            prevIndex = currentIndex - 1;
          }
          break;
        case PlayMode.SHUFFLE:
          // 随机播放：生成不同于当前的随机索引
          if (playlist.length > 1) {
            do {
              prevIndex = Math.floor(Math.random() * playlist.length);
            } while (prevIndex === currentIndex);
          }
          break;
        case PlayMode.REPEAT_ONE:
          // 单曲循环：保持当前索引
          prevIndex = currentIndex;
          break;
        case PlayMode.REPEAT_ALL:
          // 列表循环：到开头时回到末尾
          prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
          break;
      }
      
      if (prevIndex !== currentIndex || playMode === PlayMode.REPEAT_ONE) {
        state.currentIndex = prevIndex;
        state.currentSong = playlist[prevIndex];
      }
    },
  },
});

export const {
  setCurrentSong,
  setIsPlaying,
  setVolume,
  setCurrentTime,
  setDuration,
  setPlaylist,
  setCurrentIndex,
  setPlayMode,
  toggleMute,
  setShowPlaylist,
  toggleFullscreen,
  playNext,
  playPrevious,
} = playerSlice.actions;

export default playerSlice.reducer;
