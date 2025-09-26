import { Howl, Howler } from 'howler';
import { Song } from '../types';
import { store } from '../store';
import { 
  setIsPlaying, 
  setCurrentTime, 
  setDuration, 
  setCurrentSong,
  playNext 
} from '../store/slices/playerSlice';

class AudioService {
  private currentHowl: Howl | null = null;
  private updateInterval: number | null = null;

  constructor() {
    // 全局音量设置
    Howler.volume(0.8);
  }

  // 播放歌曲
  playSong(song: Song) {
    console.log('🎵 开始播放歌曲:', song.title, '音频URL:', song.audioUrl);
    
    // 停止当前播放的音乐
    this.stop();

    // 更新Redux状态
    store.dispatch(setCurrentSong(song));

    // 创建新的Howl实例
    this.currentHowl = new Howl({
      src: [song.audioUrl],
      html5: true, // 使用HTML5音频，支持流式播放
      preload: true,
      onload: () => {
        console.log('✅ 音频加载成功:', song.title);
        if (this.currentHowl) {
          const duration = this.currentHowl.duration();
          console.log('音频时长:', duration);
          store.dispatch(setDuration(duration));
        }
      },
      onloadstart: () => {
        console.log('🔄 开始加载音频:', song.title);
      },
      onplay: () => {
        console.log('▶️ 音频开始播放:', song.title);
        store.dispatch(setIsPlaying(true));
        this.startProgressUpdate();
      },
      onpause: () => {
        console.log('⏸️ 音频暂停:', song.title);
        store.dispatch(setIsPlaying(false));
        this.stopProgressUpdate();
      },
      onend: () => {
        console.log('⏹️ 音频播放结束:', song.title);
        store.dispatch(setIsPlaying(false));
        this.stopProgressUpdate();
        // 自动播放下一首
        store.dispatch(playNext());
      },
      onloaderror: (id, error) => {
        console.error('❌ 音频加载失败:', {
          歌曲: song.title,
          URL: song.audioUrl,
          错误: error,
          错误ID: id
        });
        // 可以在这里显示错误提示
      },
      onplayerror: (id, error) => {
        console.error('❌ 音频播放失败:', {
          歌曲: song.title,
          URL: song.audioUrl,
          错误: error,
          错误ID: id
        });
      }
    });

    // 开始播放
    this.currentHowl.play();
  }

  // 播放/暂停切换
  togglePlayPause() {
    if (!this.currentHowl) return;

    if (this.currentHowl.playing()) {
      this.pause();
    } else {
      this.play();
    }
  }

  // 播放
  play() {
    if (this.currentHowl && !this.currentHowl.playing()) {
      this.currentHowl.play();
    }
  }

  // 暂停
  pause() {
    if (this.currentHowl && this.currentHowl.playing()) {
      this.currentHowl.pause();
    }
  }

  // 停止
  stop() {
    if (this.currentHowl) {
      this.currentHowl.stop();
      this.currentHowl.unload();
      this.currentHowl = null;
    }
    this.stopProgressUpdate();
    store.dispatch(setIsPlaying(false));
    store.dispatch(setCurrentTime(0));
  }

  // 设置播放位置
  seek(position: number) {
    if (this.currentHowl) {
      this.currentHowl.seek(position);
      store.dispatch(setCurrentTime(position));
    }
  }

  // 设置音量 (0-1)
  setVolume(volume: number) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(clampedVolume);
    // Redux状态在组件中更新
  }

  // 获取当前播放位置
  getCurrentTime(): number {
    if (this.currentHowl) {
      return this.currentHowl.seek() as number;
    }
    return 0;
  }

  // 获取音频总时长
  getDuration(): number {
    if (this.currentHowl) {
      return this.currentHowl.duration();
    }
    return 0;
  }

  // 是否正在播放
  isPlaying(): boolean {
    return this.currentHowl ? this.currentHowl.playing() : false;
  }

  // 开始进度更新
  private startProgressUpdate() {
    this.stopProgressUpdate(); // 确保不会重复创建定时器
    
    this.updateInterval = setInterval(() => {
      if (this.currentHowl && this.currentHowl.playing()) {
        const currentTime = this.getCurrentTime();
        store.dispatch(setCurrentTime(currentTime));
      }
    }, 1000); // 每秒更新一次
  }

  // 停止进度更新
  private stopProgressUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // 清理资源
  destroy() {
    this.stop();
    this.stopProgressUpdate();
  }
}

// 创建单例实例
export const audioService = new AudioService();

// 在窗口关闭时清理资源
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    audioService.destroy();
  });
}
