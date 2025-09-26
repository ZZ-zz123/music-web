import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { audioService } from '../services/audioService';

// 监听播放器状态变化的Hook
export const usePlayerListener = () => {
  const { currentSong, playlist, currentIndex } = useSelector(
    (state: RootState) => state.player
  );

  // 监听播放列表和索引变化，自动播放下一首
  useEffect(() => {
    if (currentIndex >= 0 && playlist.length > 0 && playlist[currentIndex]) {
      const song = playlist[currentIndex];
      if (song && song.id !== currentSong?.id) {
        audioService.playSong(song);
      }
    }
  }, [currentIndex, playlist, currentSong]);

  // 在组件卸载时清理音频资源
  useEffect(() => {
    return () => {
      // 不在这里清理，因为音频可能在其他页面继续播放
    };
  }, []);
};
