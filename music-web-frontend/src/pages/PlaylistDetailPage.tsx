import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { 
  PlayCircleOutlined, 
  HeartOutlined, 
  DownloadOutlined, 
  MoreOutlined,
  SearchOutlined,
  MessageOutlined
} from '@ant-design/icons';
import Header from '../components/Layout/Header';
import SongTable from '../components/Music/SongTable';
import CommentSection from '../components/Comment/CommentSection';
import { mockPlaylists } from '../data/mockData';
import { realPlaylists } from '../data/realMockData';
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

const CoverImage = styled.div<{ bgImage: string }>`
  width: 232px;
  height: 232px;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  box-shadow: 0 4px 60px rgba(0, 0, 0, 0.5);
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

const PlaylistDescription = styled.p`
  font-size: 14px;
  color: #b3b3b3;
  margin: 0 0 8px 0;
  line-height: 1.4;
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

const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { songs: realSongs, loading, error } = useRealSongs();
  const [showComments, setShowComments] = useState(false);
  
  // 优先使用真实播放列表，再使用模拟数据
  const playlist = realPlaylists.find(p => p.id === id) || 
                   mockPlaylists.find(p => p.id === id) || {
    id: id || '',
    name: 'Unknown Playlist',
    description: 'This playlist does not exist',
    coverUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="300" height="300" fill="#666666"/>' +
      '<text x="50%" y="45%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="20">未知</text>' +
      '<text x="50%" y="55%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="16">播放列表</text>' +
      '</svg>'
    ),
    songs: [],
    createdBy: 'Unknown',
    isPublic: true
  };

  // 使用真实歌曲数据，不再回退到模拟数据
  const playlistSongs = realSongs.length > 0 
    ? realSongs.slice(0, 20).map(song => ({
        ...song,
        dateAdded: song.dateAdded || '2023-11-10'
      }))
    : []; // 如果没有数据，显示空列表而不是模拟数据

  const getPlaceholderImage = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const firstChar = playlist.name.charAt(0);
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg width="232" height="232" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="232" height="232" fill="' + color + '"/>' +
      '<text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="24" font-weight="bold">' + firstChar + '</text>' +
      '</svg>'
    );
  };

  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <PlaylistHeader>
          <CoverImage bgImage={getPlaceholderImage()} />
          <PlaylistInfo>
            <PlaylistType>公开播放列表</PlaylistType>
            <PlaylistTitle>{playlist.name}</PlaylistTitle>
            {playlist.description && (
              <PlaylistDescription>{playlist.description}</PlaylistDescription>
            )}
            <PlaylistMeta>
              <UserAvatar>
                {playlist.createdBy.charAt(0).toUpperCase()}
              </UserAvatar>
              <UserName>{playlist.createdBy}</UserName>
              <span>•</span>
              <span>{playlistSongs.length} 首歌曲</span>
            </PlaylistMeta>
          </PlaylistInfo>
        </PlaylistHeader>

        <ControlsSection>
          <PlayButton>
            <PlayCircleOutlined />
          </PlayButton>
          <ActionButton>
            <HeartOutlined />
          </ActionButton>
          <ActionButton>
            <DownloadOutlined />
          </ActionButton>
          <ActionButton onClick={() => setShowComments(!showComments)}>
            <MessageOutlined />
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
          <div style={{ textAlign: 'center', color: '#ff6b6b', marginTop: '20px' }}>
            {error} - 使用模拟数据
          </div>
        )}

        <SongTable 
          songs={playlistSongs} 
          showAlbum={true} 
          showDateAdded={true} 
        />

        {/* 评论区组件 */}
        <CommentSection
          targetId={playlist.id}
          targetType="playlist"
          isVisible={showComments}
          onClose={() => setShowComments(false)}
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default PlaylistDetailPage;
