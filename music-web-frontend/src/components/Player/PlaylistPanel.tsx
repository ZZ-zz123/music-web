import React from 'react';
import styled from 'styled-components';
import { CloseOutlined, PlayCircleOutlined, PauseCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCurrentIndex, setShowPlaylist, setCurrentSong } from '../../store/slices/playerSlice';
import { audioService } from '../../services/audioService';

const PanelContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  right: 16px;
  bottom: 106px;
  width: 380px;
  height: 480px;
  background: #181818;
  border-radius: 8px;
  border: 1px solid #282828;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  z-index: 1001;
  display: ${props => props.$isVisible ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #282828;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .anticon {
    font-size: 16px;
  }
`;

const PlaylistContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  
  &::-webkit-scrollbar {
    width: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #404040;
    border-radius: 6px;
    border: 2px solid #181818;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #535353;
  }
`;

const SongItem = styled.div<{ $isPlaying: boolean; $isCurrent: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
  margin: 0 8px;
  background: ${props => props.$isCurrent ? 'rgba(29, 185, 84, 0.1)' : 'transparent'};
  
  &:hover {
    background: ${props => props.$isCurrent ? 'rgba(29, 185, 84, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const SongCover = styled.div<{ $bgImage?: string }>`
  width: 40px;
  height: 40px;
  background-image: url(${props => props.$bgImage || 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">' +
    '<rect width="40" height="40" fill="#404040"/>' +
    '<text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="12">♪</text>' +
    '</svg>'
  )});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const SongInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SongTitle = styled.div<{ $isCurrent: boolean }>`
  color: ${props => props.$isCurrent ? '#1db954' : 'white'};
  font-size: 14px;
  font-weight: ${props => props.$isCurrent ? 500 : 400};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

const SongArtist = styled.div`
  color: #b3b3b3;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SongActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
  
  ${SongItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    color: white;
  }
  
  .anticon {
    font-size: 14px;
  }
`;

const PlayingIcon = styled.div<{ $isPlaying: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1db954;
  margin-right: 8px;
  
  .anticon {
    font-size: 16px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #b3b3b3;
  text-align: center;
  padding: 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

interface PlaylistPanelProps {}

const PlaylistPanel: React.FC<PlaylistPanelProps> = () => {
  const dispatch = useDispatch();
  const { 
    playlist, 
    currentIndex, 
    currentSong, 
    isPlaying, 
    showPlaylist 
  } = useSelector((state: RootState) => state.player);

  const handleClose = () => {
    dispatch(setShowPlaylist(false));
  };

  const handleSongClick = (index: number) => {
    if (index !== currentIndex) {
      dispatch(setCurrentIndex(index));
      dispatch(setCurrentSong(playlist[index]));
      audioService.playSong(playlist[index]);
    } else {
      // 如果点击的是当前歌曲，切换播放/暂停
      audioService.togglePlayPause();
    }
  };

  const handleRemoveFromPlaylist = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: 实现从播放列表移除歌曲的功能
    console.log('Remove song at index:', index);
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <PanelContainer $isVisible={showPlaylist}>
      <PanelHeader>
        <PanelTitle>播放队列</PanelTitle>
        <CloseButton onClick={handleClose}>
          <CloseOutlined />
        </CloseButton>
      </PanelHeader>

      <PlaylistContainer>
        {playlist.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🎵</EmptyIcon>
            <EmptyText>播放队列为空</EmptyText>
            <EmptySubtext>选择一些歌曲开始播放</EmptySubtext>
          </EmptyState>
        ) : (
          playlist.map((song, index) => {
            const isCurrent = index === currentIndex;
            return (
              <SongItem
                key={`${song.id}-${index}`}
                $isPlaying={isPlaying && isCurrent}
                $isCurrent={isCurrent}
                onClick={() => handleSongClick(index)}
              >
                <SongCover $bgImage={song.coverUrl} />
                
                {isCurrent && (
                  <PlayingIcon $isPlaying={isPlaying}>
                    {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  </PlayingIcon>
                )}
                
                <SongInfo>
                  <SongTitle $isCurrent={isCurrent}>{song.title}</SongTitle>
                  <SongArtist>{song.artist}</SongArtist>
                </SongInfo>

                <SongActions>
                  <ActionButton 
                    onClick={(e) => handleRemoveFromPlaylist(index, e)}
                    title="从队列中移除"
                  >
                    <DeleteOutlined />
                  </ActionButton>
                </SongActions>
              </SongItem>
            );
          })
        )}
      </PlaylistContainer>
    </PanelContainer>
  );
};

export default PlaylistPanel;
