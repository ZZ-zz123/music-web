import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  PlayCircleOutlined, 
  PauseCircleOutlined,
  HeartFilled,
  HeartOutlined,
  MoreOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Song } from '../../types';
import { audioService } from '../../services/audioService';

const TableContainer = styled.div`
  color: white;
  padding-bottom: 100px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 16px 1fr 1fr 200px 80px;
  gap: 16px;
  padding: 8px 16px;
  border-bottom: 1px solid #282828;
  color: #b3b3b3;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 16px 1fr 80px;
    
    .album-header,
    .date-header {
      display: none;
    }
  }
`;

const TableRow = styled.div<{ isPlaying?: boolean }>`
  display: grid;
  grid-template-columns: 16px 1fr 1fr 200px 80px;
  gap: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.1s;
  align-items: center;
  min-height: 56px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    
    .play-button {
      opacity: 1;
    }
    
    .track-number {
      opacity: 0;
    }
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 16px 1fr 80px;
    
    .album-column,
    .date-column {
      display: none;
    }
  }
`;

const TrackNumberContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TrackNumber = styled.span`
  color: #b3b3b3;
  font-size: 14px;
  transition: opacity 0.1s;
`;

const PlayButton = styled.button`
  position: absolute;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.1s;
  padding: 0;
  
  .anticon {
    color: white;
    font-size: 16px;
  }
`;

const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const TrackImage = styled.div<{ bgImage: string }>`
  width: 40px;
  height: 40px;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  flex-shrink: 0;
`;

const TrackDetails = styled.div`
  min-width: 0;
  flex: 1;
`;

const TrackTitle = styled.div<{ isPlaying?: boolean }>`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.isPlaying ? '#1db954' : 'white'};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TrackArtist = styled.div`
  font-size: 14px;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AlbumName = styled.div`
  font-size: 14px;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const DateAdded = styled.div`
  font-size: 14px;
  color: #b3b3b3;
`;

const TrackActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-end;
`;

const LikeButton = styled.button<{ $liked?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  
  .anticon {
    color: ${props => props.$liked ? '#1db954' : '#b3b3b3'};
    font-size: 16px;
    transition: color 0.2s;
  }
  
  &:hover .anticon {
    color: ${props => props.$liked ? '#1ed760' : 'white'};
  }
`;

const Duration = styled.div`
  font-size: 14px;
  color: #b3b3b3;
  min-width: 40px;
  text-align: right;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.1s;
  padding: 4px;
  
  .anticon {
    color: #b3b3b3;
    font-size: 16px;
  }
  
  &:hover .anticon {
    color: white;
  }
  
  ${TableRow}:hover & {
    opacity: 1;
  }
`;

interface SongTableProps {
  songs: Song[];
  showAlbum?: boolean;
  showDateAdded?: boolean;
  currentPlayingId?: string;
}

const SongTable: React.FC<SongTableProps> = ({ 
  songs, 
  showAlbum = false, 
  showDateAdded = false,
  currentPlayingId 
}) => {
  const navigate = useNavigate();
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set(songs.map(song => song.id)));

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 天前';
    if (diffDays < 7) return `${diffDays} 天前`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} 周前`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} 个月前`;
    return `${Math.ceil(diffDays / 365)} 年前`;
  };

  const toggleLike = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  const handlePlayPause = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const song = songs.find(s => s.id === songId);
    if (song) {
      if (currentPlayingId === songId) {
        // 当前歌曲，切换播放/暂停
        audioService.togglePlayPause();
      } else {
        // 播放新歌曲
        audioService.playSong(song);
      }
    }
  };

  const handleTitleClick = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/song/${songId}`);
  };

  const gridCols = showAlbum && showDateAdded 
    ? '16px 1fr 1fr 200px 80px' 
    : showAlbum 
    ? '16px 1fr 1fr 80px'
    : '16px 1fr 80px';

  return (
    <TableContainer>
      <TableHeader style={{ gridTemplateColumns: gridCols }}>
        <div>#</div>
        <div>标题</div>
        {showAlbum && <div className="album-header">专辑</div>}
        {showDateAdded && <div className="date-header">添加日期</div>}
        <div style={{ textAlign: 'right' }}>
          <ClockCircleOutlined />
        </div>
      </TableHeader>
      
      {songs.map((song, index) => {
        const isPlaying = currentPlayingId === song.id;
        const isLiked = likedSongs.has(song.id);
        
        return (
          <TableRow 
            key={song.id} 
            isPlaying={isPlaying}
            style={{ gridTemplateColumns: gridCols }}
          >
            <TrackNumberContainer>
              <TrackNumber className="track-number">{index + 1}</TrackNumber>
              <PlayButton 
                className="play-button"
                onClick={(e) => handlePlayPause(song.id, e)}
              >
                {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              </PlayButton>
            </TrackNumberContainer>
            
            <TrackInfo>
              <TrackImage bgImage={song.coverUrl} />
              <TrackDetails>
                <TrackTitle 
                  isPlaying={isPlaying}
                  onClick={(e) => handleTitleClick(song.id, e)}
                >
                  {song.title}
                </TrackTitle>
                <TrackArtist>{song.artist}</TrackArtist>
              </TrackDetails>
            </TrackInfo>
            
            {showAlbum && (
              <AlbumName className="album-column">{song.album}</AlbumName>
            )}
            
            {showDateAdded && (
              <DateAdded className="date-column">
                {formatDate(song.dateAdded || '2023-01-01')}
              </DateAdded>
            )}
            
            <TrackActions>
              <LikeButton 
                $liked={isLiked}
                onClick={(e) => toggleLike(song.id, e)}
              >
                {isLiked ? <HeartFilled /> : <HeartOutlined />}
              </LikeButton>
              <Duration>{formatDuration(song.duration)}</Duration>
              <MoreButton>
                <MoreOutlined />
              </MoreButton>
            </TrackActions>
          </TableRow>
        );
      })}
    </TableContainer>
  );
};

export default SongTable;
