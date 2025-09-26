import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { 
  StepBackwardOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  StepForwardOutlined,
  SwapOutlined,
  ReloadOutlined,
  SoundOutlined,
  ExpandOutlined,
  HeartOutlined,
  MenuOutlined,
  HeartFilled,
  SoundFilled,
  RedoOutlined,
  RetweetOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  setIsPlaying, 
  setVolume, 
  playNext, 
  playPrevious, 
  setPlayMode,
  toggleMute,
  setShowPlaylist,
  toggleFullscreen
} from '../../store/slices/playerSlice';
import { PlayMode } from '../../types';
import { audioService } from '../../services/audioService';
import PlaylistPanel from './PlaylistPanel';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background: #181818;
  border-top: 1px solid #282828;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
`;

const CurrentTrack = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
  min-width: 180px;
`;

const TrackImage = styled.div<{ bgImage?: string }>`
  width: 56px;
  height: 56px;
  background-image: url(${props => props.bgImage || 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg width="56" height="56" xmlns="http://www.w3.org/2000/svg">' +
    '<rect width="56" height="56" fill="#404040"/>' +
    '<text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="14">♪</text>' +
    '</svg>'
  )});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-right: 14px;
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TrackTitle = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TrackArtist = styled.div`
  color: #b3b3b3;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const TrackActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 14px;
`;

const ActionButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.active ? '#1db954' : '#b3b3b3'};
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: color 0.2s;
  
  &:hover {
    color: white;
  }
  
  .anticon {
    font-size: 16px;
  }
`;

const PlayerControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  max-width: 722px;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
`;

const ControlButton = styled.button<{ size?: 'small' | 'large' }>`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    color: white;
    transform: scale(1.06);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .anticon {
    font-size: ${props => props.size === 'large' ? '32px' : '16px'};
  }
`;

const PlayButton = styled(ControlButton)`
  color: white;
  
  &:hover {
    transform: scale(1.06);
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

const TimeDisplay = styled.span`
  color: #b3b3b3;
  font-size: 11px;
  min-width: 40px;
  text-align: center;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: #4f4f4f;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  
  &:hover {
    height: 6px;
    margin: -1px 0;
  }
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: #b3b3b3;
  border-radius: 2px;
  width: ${props => props.progress}%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  ${ProgressBar}:hover &::after {
    opacity: 1;
  }
  
  ${ProgressBar}:hover & {
    background: #1db954;
  }
`;

const VolumeSection = styled.div`
  display: flex;
  align-items: center;
  width: 30%;
  justify-content: flex-end;
  gap: 8px;
`;

const VolumeButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: white;
  }
  
  .anticon {
    font-size: 16px;
  }
`;

const VolumeBar = styled.div`
  width: 93px;
  height: 4px;
  background: #4f4f4f;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
  
  &:hover {
    height: 6px;
    margin: -1px 0;
  }
`;

const VolumeFill = styled.div<{ volume: number }>`
  height: 100%;
  background: #b3b3b3;
  border-radius: 2px;
  width: ${props => props.volume * 100}%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  ${VolumeBar}:hover &::after {
    opacity: 1;
  }
  
  ${VolumeBar}:hover & {
    background: #1db954;
  }
`;

const PlayerBar: React.FC = () => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    isMuted,
    currentTime, 
    duration,
    playMode,
    showPlaylist,
    isFullscreen
  } = useSelector((state: RootState) => state.player);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (currentSong) {
      audioService.togglePlayPause();
    }
  };

  // 音量控制
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.min(Math.max(x / rect.width, 0), 1);
    dispatch(setVolume(newVolume));
    audioService.setVolume(newVolume);
  };

  const handleMuteToggle = () => {
    dispatch(toggleMute());
    audioService.setVolume(isMuted ? volume : 0);
  };

  // 进度条控制
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newTime = (x / rect.width) * duration;
      audioService.seek(newTime);
    }
  };

  // 播放控制
  const handleNext = () => {
    dispatch(playNext());
  };

  const handlePrevious = () => {
    dispatch(playPrevious());
  };

  // 播放模式切换
  const handlePlayModeToggle = () => {
    const modes = [PlayMode.SEQUENTIAL, PlayMode.SHUFFLE, PlayMode.REPEAT_ALL, PlayMode.REPEAT_ONE];
    const currentIndex = modes.indexOf(playMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    dispatch(setPlayMode(modes[nextIndex]));
  };

  const getPlayModeIcon = () => {
    switch (playMode) {
      case PlayMode.SHUFFLE:
        return <RetweetOutlined style={{ color: '#1db954' }} />;
      case PlayMode.REPEAT_ONE:
        return <RedoOutlined style={{ color: '#1db954' }} />;
      case PlayMode.REPEAT_ALL:
        return <ReloadOutlined style={{ color: '#1db954' }} />;
      default:
        return <SwapOutlined />;
    }
  };

  const getPlayModeTooltip = () => {
    switch (playMode) {
      case PlayMode.SHUFFLE:
        return '随机播放';
      case PlayMode.REPEAT_ONE:
        return '单曲循环';
      case PlayMode.REPEAT_ALL:
        return '列表循环';
      default:
        return '顺序播放';
    }
  };

  // 其他功能
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    // TODO: 实现收藏功能API调用
  };

  const handlePlaylistToggle = () => {
    dispatch(setShowPlaylist(!showPlaylist));
  };

  const handleFullscreenToggle = () => {
    dispatch(toggleFullscreen());
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <SoundFilled style={{ opacity: 0.6 }} />;
    } else if (volume > 0.5) {
      return <SoundFilled />;
    } else {
      return <SoundOutlined />;
    }
  };

  return (
    <>
      <PlayerContainer>
        <CurrentTrack>
          <TrackImage bgImage={currentSong?.coverUrl} />
          <TrackInfo>
            <TrackTitle>{currentSong?.title || '暂无播放'}</TrackTitle>
            <TrackArtist>{currentSong?.artist || '选择歌曲开始播放'}</TrackArtist>
          </TrackInfo>
          <TrackActions>
            <ActionButton 
              active={isLiked}
              onClick={handleLikeToggle}
              title={isLiked ? '取消收藏' : '收藏'}
            >
              {isLiked ? <HeartFilled /> : <HeartOutlined />}
            </ActionButton>
          </TrackActions>
        </CurrentTrack>

        <PlayerControls>
          <ControlButtons>
            <ControlButton 
              onClick={handlePlayModeToggle}
              title={getPlayModeTooltip()}
            >
              {getPlayModeIcon()}
            </ControlButton>
            <ControlButton 
              onClick={handlePrevious}
              disabled={!currentSong}
              title="上一首"
            >
              <StepBackwardOutlined />
            </ControlButton>
            <PlayButton 
              size="large" 
              onClick={handlePlayPause}
              disabled={!currentSong}
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            </PlayButton>
            <ControlButton 
              onClick={handleNext}
              disabled={!currentSong}
              title="下一首"
            >
              <StepForwardOutlined />
            </ControlButton>
          </ControlButtons>
          
          <ProgressContainer>
            <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
            <ProgressBar 
              ref={progressRef}
              onClick={handleProgressClick}
              title="点击跳转到指定位置"
            >
              <ProgressFill progress={duration > 0 ? (currentTime / duration) * 100 : 0} />
            </ProgressBar>
            <TimeDisplay>{formatTime(duration)}</TimeDisplay>
          </ProgressContainer>
        </PlayerControls>

        <VolumeSection>
          <VolumeButton
            onClick={handlePlaylistToggle}
            title="播放队列"
            style={{ color: showPlaylist ? '#1db954' : '#b3b3b3' }}
          >
            <MenuOutlined />
          </VolumeButton>
          <VolumeButton
            onClick={handleMuteToggle}
            title={isMuted ? '取消静音' : '静音'}
          >
            {getVolumeIcon()}
          </VolumeButton>
          <VolumeBar 
            ref={volumeRef}
            onClick={handleVolumeChange}
            title={`音量: ${Math.round(volume * 100)}%`}
          >
            <VolumeFill volume={isMuted ? 0 : volume} />
          </VolumeBar>
          <VolumeButton
            onClick={handleFullscreenToggle}
            title={isFullscreen ? '退出全屏' : '全屏'}
            style={{ color: isFullscreen ? '#1db954' : '#b3b3b3' }}
          >
            <ExpandOutlined />
          </VolumeButton>
        </VolumeSection>
      </PlayerContainer>
      
      <PlaylistPanel />
    </>
  );
};

export default PlayerBar;
