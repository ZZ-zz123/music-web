import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';

const CardContainer = styled(Link)`
  background: #181818;
  border-radius: 8px;
  padding: 16px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: block;
  
  &:hover {
    background: #282828;
    transform: translateY(-4px);
    
    .play-button {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const CoverImage = styled.div<{ bgImage: string }>`
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

const HiddenImage = styled.img`
  display: none;
`;

const PlayButton = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 48px;
  height: 48px;
  background: #1db954;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 8px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: #1ed760;
    transform: scale(1.05);
  }
  
  .anticon {
    color: black;
    font-size: 20px;
    margin-left: 2px;
  }
`;

const CardContent = styled.div`
  color: white;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: white;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const Description = styled.p`
  font-size: 14px;
  color: #b3b3b3;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 40px;
`;

interface PlaylistCardProps {
  playlist: {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    createdBy: string;
  };
  to: string;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, to }) => {
  const [imageError, setImageError] = useState(false);

  const getPlaceholderImage = () => {
    // 根据播放列表名称生成不同的颜色
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#ff7675', '#6c5ce7'];
    const colorIndex = playlist.name.length % colors.length;
    const color = colors[colorIndex];
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="160" height="160" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="160" fill="${color}"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="12" font-weight="bold">${playlist.name.charAt(0)}</text>
      </svg>
    `)}`;
  };

  return (
    <CardContainer to={to}>
      <ImageContainer>
        <CoverImage 
          bgImage={playlist.coverUrl.startsWith('data:image/svg') ? playlist.coverUrl : (imageError ? getPlaceholderImage() : playlist.coverUrl)}
        />
        {!playlist.coverUrl.startsWith('data:image/svg') && (
          <HiddenImage 
            src={playlist.coverUrl}
            onError={() => setImageError(true)}
            alt=""
          />
        )}
        <PlayButton className="play-button">
          <PlayCircleOutlined />
        </PlayButton>
      </ImageContainer>
      <CardContent>
        <Title>{playlist.name}</Title>
        <Description>
          {playlist.createdBy === 'Spotify' ? `来自 ${playlist.createdBy}` : `由 ${playlist.createdBy} 创建`}
          {playlist.description && ` • ${playlist.description}`}
        </Description>
      </CardContent>
    </CardContainer>
  );
};

export default PlaylistCard;
