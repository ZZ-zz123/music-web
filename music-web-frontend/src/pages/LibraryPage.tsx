import React, { useState } from 'react';
import styled from 'styled-components';
// import { Link } from 'react-router-dom';
import Header from '../components/Layout/Header';
import PlaylistCard from '../components/Music/PlaylistCard';
import LikedSongsCard from '../components/Music/LikedSongsCard';
// import { generatePlaylistCover } from '../utils/imageGenerator';
// import { mockPlaylists } from '../data/mockData';
import { realPlaylists } from '../data/realMockData';
import { useRealSongs } from '../hooks/useRealData';

const LibraryContainer = styled.div`
  background: linear-gradient(180deg, #2d5a27 0%, #121212 300px);
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 0 32px 100px;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 12px;
  margin: 24px 0 32px;
`;

const FilterTab = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#000000' : '#ffffff'};
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#ffffff' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const PlaylistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }
`;

const LikedSongsGridItem = styled.div`
  grid-column: span 2;
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const LibraryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('playlists');
  const { songs: realSongs, loading, error } = useRealSongs();

  const filters = [
    { id: 'playlists', label: '播放列表' },
    { id: 'podcasts', label: '播客' },
    { id: 'artists', label: '艺术家' },
    { id: 'albums', label: '专辑' },
  ];

  // 基于真实歌曲数据的播放列表
  const allPlaylists = realSongs.length > 0 ? [
    {
      id: 'liked',
      name: '喜欢的音乐',
      description: `${realSongs.length} 首喜欢的歌曲`,
        coverUrl: `/img/songListPic/109951163826485303.jpg`,
      songs: [],
      createdBy: 'davidfred13',
      isPublic: true,
      type: 'liked'
    },
    ...realPlaylists.map(playlist => ({
      ...playlist,
      description: playlist.description || `根据你喜欢的${playlist.genre}歌曲创建`
    }))
  ] : [
    {
      id: 'liked',
      name: '喜欢的音乐',
      description: '607 首喜欢的歌曲',
        coverUrl: `/img/songListPic/109951163826485303.jpg`,
      songs: [],
      createdBy: 'davidfred13',
      isPublic: true,
      type: 'liked'
    },
    {
      id: 'happy-hits',
      name: 'Happy Hits!',
      description: 'Hits to boost your mood and fill you with happiness!',
        coverUrl: `/img/songListPic/109951163826485303.jpg`,
      songs: [],
      createdBy: 'Spotify',
      isPublic: true
    },
    {
      id: 'anime-lofi',
      name: 'Anime Lofi & Chillhop Music',
      description: 'Experience the best Anime moments again with these Lofi tracks',
        coverUrl: `/img/songListPic/109951163826485303.jpg`,
      songs: [],
      createdBy: 'Spotify',
      isPublic: true
    },
    {
      id: 'afro-select',
      name: 'Afro "Select" Vibes',
      description: 'A compilation of hit African songs I consider my favourite',
        coverUrl: `/img/songListPic/109951163826485303.jpg`,
      songs: [],
      createdBy: 'davidfred13',
      isPublic: true
    },
    {
      id: 'instrumental-study',
      name: 'Instrumental Study',
      description: 'A soft musical backdrop for your study session',
        coverUrl: `/img/songListPic/109951163826485303.jpg`,
      songs: [],
      createdBy: 'Spotify',
      isPublic: true
    },
    {
      id: 'pop-mix',
      name: 'Pop Mix',
      description: 'Hey Violet, VÉRITÉ, Timelines and more',
        coverUrl: `/img/songListPic/109951163826485303.jpg`,
      songs: [],
      createdBy: 'Spotify',
      isPublic: true
    },
    {
      id: 'chill-mix',
      name: 'Chill Mix',
      description: 'Julia Wolf, Khalid, ayokay and more',
        coverUrl: `/img/songListPic/109951163826485303.jpg`,
      songs: [],
      createdBy: 'Spotify',
      isPublic: true
    }
  ];

  return (
    <LibraryContainer>
      <Header />
      <ContentContainer>
        <FilterTabs>
          {filters.map(filter => (
            <FilterTab
              key={filter.id}
              $active={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </FilterTab>
          ))}
        </FilterTabs>

        {activeFilter === 'playlists' && (
          <>
            {loading && (
              <div style={{ textAlign: 'center', color: '#b3b3b3', marginTop: '50px' }}>
                正在加载音乐库...
              </div>
            )}

            {error && (
              <div style={{ textAlign: 'center', color: '#ff6b6b', marginTop: '20px', marginBottom: '20px' }}>
                {error} - 使用默认播放列表
              </div>
            )}

            <PlaylistsGrid>
              <LikedSongsGridItem>
                <LikedSongsCard 
                  songCount={realSongs.length || 607}
                  to="/liked"
                />
              </LikedSongsGridItem>
              
              {allPlaylists.slice(1).map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  to={`/playlist/${playlist.id}`}
                />
              ))}
            </PlaylistsGrid>
          </>
        )}

        {activeFilter === 'podcasts' && (
          <div style={{ color: '#b3b3b3', fontSize: '16px', textAlign: 'center', marginTop: '64px' }}>
            暂无播客内容
          </div>
        )}

        {activeFilter === 'artists' && (
          <div style={{ color: '#b3b3b3', fontSize: '16px', textAlign: 'center', marginTop: '64px' }}>
            暂无关注的艺术家
          </div>
        )}

        {activeFilter === 'albums' && (
          <div style={{ color: '#b3b3b3', fontSize: '16px', textAlign: 'center', marginTop: '64px' }}>
            暂无收藏的专辑
          </div>
        )}
      </ContentContainer>
    </LibraryContainer>
  );
};

export default LibraryPage;
