import React, { useState } from 'react';
import styled from 'styled-components';
import { PlayCircleOutlined } from '@ant-design/icons';
import { MixCard as MixCardType } from '../../types';

const CardContainer = styled.div`
  background: #181818;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
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

const Subtitle = styled.p`
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

interface MixCardProps {
  mixCard: MixCardType;
  onClick?: () => void;
}

const MixCard: React.FC<MixCardProps> = ({ mixCard, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getPlaceholderImage = () => {
    // 生成随机颜色作为占位符
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg width="160" height="160" xmlns="http://www.w3.org/2000/svg">
        <rect width="160" height="160" fill="${color}"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="14">音乐</text>
      </svg>
    `)}`;
  };

  return (
    <CardContainer onClick={onClick}>
      <ImageContainer>
        <CoverImage 
          bgImage={mixCard.coverUrl.startsWith('data:image/svg') ? mixCard.coverUrl : (imageError ? getPlaceholderImage() : mixCard.coverUrl)}
        />
        {!mixCard.coverUrl.startsWith('data:image/svg') && (
          <img 
            src={mixCard.coverUrl}
            onError={handleImageError}
            style={{ display: 'none' }}
            alt=""
          />
        )}
        <PlayButton className="play-button">
          <PlayCircleOutlined />
        </PlayButton>
      </ImageContainer>
      <CardContent>
        <Title>{mixCard.title}</Title>
        <Subtitle>{mixCard.subtitle}</Subtitle>
      </CardContent>
    </CardContainer>
  );
};

export default MixCard;
