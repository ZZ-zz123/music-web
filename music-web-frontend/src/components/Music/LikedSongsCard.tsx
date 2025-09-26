import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { HeartFilled } from '@ant-design/icons';

const CardContainer = styled(Link)`
  display: flex;
  background: linear-gradient(135deg, #450af5, #c4efd9);
  border-radius: 8px;
  padding: 20px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  min-height: 240px;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  z-index: 2;
`;

const TopSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
`;

const HeartIcon = styled(HeartFilled)`
  font-size: 48px;
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
`;

const SongList = styled.div`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  opacity: 0.9;
  max-height: 120px;
  overflow: hidden;
`;

const SongItem = styled.div`
  margin-bottom: 2px;
`;

const BottomSection = styled.div`
  margin-top: 16px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 8px 0;
  color: white;
`;

const SongCount = styled.div`
  font-size: 16px;
  font-weight: 600;
  opacity: 0.9;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30px, -30px);
`;

interface LikedSongsCardProps {
  songCount: number;
  to: string;
}

const LikedSongsCard: React.FC<LikedSongsCardProps> = ({ songCount, to }) => {
  const sampleSongs = [
    'Adekunle Gold Here For Ya • Julia Wolf Pillow •',
    'Claud If I Were You • The Wildlfe The Other ...',
    'Yoke Lore Goodpain • Ayra Starr Memories ...'
  ];

  return (
    <CardContainer to={to}>
      <ContentArea>
        <TopSection>
          <HeartIcon />
          <SongList>
            {sampleSongs.map((song, index) => (
              <SongItem key={index}>{song}</SongItem>
            ))}
          </SongList>
        </TopSection>
        
        <BottomSection>
          <Title>喜欢的音乐</Title>
          <SongCount>{songCount} 首喜欢的歌曲</SongCount>
        </BottomSection>
      </ContentArea>
      
      <BackgroundPattern />
    </CardContainer>
  );
};

export default LikedSongsCard;
