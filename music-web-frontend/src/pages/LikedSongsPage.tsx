import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  PlayCircleOutlined, 
  HeartFilled, 
  DownloadOutlined, 
  MoreOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import Header from '../components/Layout/Header';
import SongTable from '../components/Music/SongTable';
import { mockLikedSongs } from '../data/mockData';
import { useRealSongs } from '../hooks/useRealData';

const PageContainer = styled.div`
  background: linear-gradient(180deg, #5038a0 0%, #121212 300px);
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 0 32px;
`;

const PlaylistHeader = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 80px 0 24px;
  gap: 24px;
`;

const CoverImage = styled.div`
  width: 232px;
  height: 232px;
  background: linear-gradient(135deg, #450af5, #c4efd9);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
`;

const HeartIcon = styled(HeartFilled)`
  font-size: 80px;
  color: white;
`;

const PlaylistInfo = styled.div`
  color: white;
  flex: 1;
`;

const PlaylistType = styled.div`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
  letter-spacing: 1px;
`;

const PlaylistTitle = styled.h1`
  font-size: 96px;
  font-weight: 900;
  margin: 0 0 24px 0;
  line-height: 1;
  
  @media (max-width: 1200px) {
    font-size: 72px;
  }
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const PlaylistMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #b3b3b3;
`;

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1db954;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: black;
  margin-right: 4px;
`;

const UserName = styled.span`
  color: white;
  font-weight: 700;
`;

const SongCount = styled.span`
  margin-left: 4px;
`;

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 24px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
`;

const PlayButton = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #1db954;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s;
  
  &:hover {
    background: #1ed760;
    transform: scale(1.04);
  }
  
  .anticon {
    color: black;
    font-size: 24px;
    margin-left: 2px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  
  .anticon {
    font-size: 32px;
    color: #b3b3b3;
    transition: color 0.2s;
  }
  
  &:hover .anticon {
    color: white;
  }
`;

const MoreButton = styled(ActionButton)`
  .anticon {
    font-size: 24px;
  }
`;

const SearchSection = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b3b3b3;
  font-size: 14px;
  font-weight: 600;
  padding: 8px;
  
  &:hover {
    color: white;
  }
  
  .anticon {
    font-size: 16px;
  }
`;

const CustomOrderButton = styled.button`
  background: none;
  border: 1px solid #727272;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 16px;
  
  &:hover {
    border-color: white;
  }
`;

const LikedSongsPage: React.FC = () => {
  // 使用真实数据
  const { songs: realSongs, loading, error } = useRealSongs();
  
  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <PlaylistHeader>
          <CoverImage>
            <HeartIcon />
          </CoverImage>
          <PlaylistInfo>
            <PlaylistType>公开播放列表</PlaylistType>
            <PlaylistTitle>喜欢的音乐</PlaylistTitle>
            <PlaylistMeta>
              <UserAvatar>D</UserAvatar>
              <UserName>davidfred13</UserName>
              <span>•</span>
              <SongCount>34 首歌曲</SongCount>
            </PlaylistMeta>
          </PlaylistInfo>
        </PlaylistHeader>

        <ControlsSection>
          <PlayButton>
            <PlayCircleOutlined />
          </PlayButton>
          <ActionButton>
            <HeartFilled style={{ color: '#1db954' }} />
          </ActionButton>
          <ActionButton>
            <DownloadOutlined />
          </ActionButton>
          <MoreButton>
            <MoreOutlined />
          </MoreButton>
        </ControlsSection>

        <SearchSection>
          <SearchButton>
            <SearchOutlined />
            搜索自定义排序
          </SearchButton>
          <CustomOrderButton>自定义排序</CustomOrderButton>
        </SearchSection>

        {loading && (
          <div style={{ textAlign: 'center', color: '#b3b3b3', marginTop: '50px' }}>
            正在加载歌曲...
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', color: '#ff6b6b', marginTop: '50px' }}>
            {error} - 使用模拟数据
          </div>
        )}
        
        <SongTable 
          songs={(!loading && realSongs.length > 0) ? realSongs : mockLikedSongs} 
          showAlbum={true} 
          showDateAdded={true} 
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default LikedSongsPage;
