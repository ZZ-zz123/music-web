import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlayCircleOutlined } from '@ant-design/icons';
import SongTable from '../Music/SongTable';
import PlaylistCard from '../Music/PlaylistCard';
import { mockPlaylists } from '../../data/mockData';
import { songApi, singerApi, getFullBackendUrl } from '../../services/api';
import { Song, Playlist } from '../../types';
import { generateDefaultCover, getRandomColor } from '../../utils/encoding';

const ResultsContainer = styled.div`
  color: white;
`;

const Section = styled.div`
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
`;

const TopResult = styled.div`
  background: #181818;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
  width: 400px;
  
  &:hover {
    background: #282828;
    
    .play-button {
      opacity: 1;
    }
  }
`;

const TopResultImage = styled.div<{ $bgImage: string }>`
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background-image: url(${props => props.$bgImage});
  background-size: cover;
  background-position: center;
  margin-bottom: 16px;
`;

const TopResultTitle = styled.h3`
  font-size: 32px;
  font-weight: 900;
  color: white;
  margin: 0 0 8px 0;
`;

const TopResultType = styled.div`
  background: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
`;

const TopResultPlayButton = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  background: #1db954;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
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

const SongsSection = styled.div`
  margin-bottom: 32px;
`;

const PlaylistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
`;

const NoResults = styled.div`
  text-align: center;
  color: #b3b3b3;
  font-size: 16px;
  margin-top: 64px;
`;

interface SearchResultsProps {
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [results, setResults] = useState<{
    songs: Song[];
    singers: any[];
    playlists: Playlist[];
    topResult: any;
  }>({
    songs: [],
    singers: [],
    playlists: [],
    topResult: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ songs: [], singers: [], playlists: [], topResult: null });
      return;
    }
    
    // 防抖：500ms后执行搜索
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 500);
    
    // 清理函数
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('搜索关键词:', searchQuery);
      
      // 并行调用搜索API
      const [songsResponse, singersResponse] = await Promise.all([
        songApi.searchSongs(searchQuery, 20),
        singerApi.searchSingers(searchQuery, 10)
      ]);
      
      console.log('搜索结果 - 歌曲:', songsResponse);
      console.log('搜索结果 - 歌手:', singersResponse);
      
      // 转换歌曲数据格式
      const transformedSongs: Song[] = (songsResponse || []).map((song: any) => ({
        id: song.id.toString(),
        title: song.name,
        artist: song.singerName || '未知歌手',
        album: song.albumName || '未知专辑',
        duration: song.duration || 240,
        coverUrl: song.coverUrl ? getFullBackendUrl(song.coverUrl) : getDefaultCoverUrl(),
        audioUrl: song.audioUrl ? getFullBackendUrl(song.audioUrl) : '',
        playCount: song.playCount || 0,
        lyrics: song.lyric || undefined,
      }));
      
      // 搜索播放列表（本地数据）
      const filteredPlaylists = mockPlaylists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // 确定最佳匹配作为顶部结果
      let topResult = null;
      if (transformedSongs.length > 0) {
        const lowerQuery = searchQuery.toLowerCase();
        const exactMatch = transformedSongs.find(song => 
          song.title.toLowerCase() === lowerQuery ||
          song.artist.toLowerCase() === lowerQuery
        );
        topResult = exactMatch || transformedSongs[0];
        topResult.type = (exactMatch && exactMatch.artist.toLowerCase() === lowerQuery) ? 'Artist' : 'Song';
      } else if (singersResponse && singersResponse.length > 0) {
        topResult = { ...singersResponse[0], type: 'Artist' };
      } else if (filteredPlaylists.length > 0) {
        topResult = { ...filteredPlaylists[0], type: 'Playlist' };
      }

      setResults({
        songs: transformedSongs.slice(0, 8), // 显示前8首歌
        singers: singersResponse || [],
        playlists: filteredPlaylists,
        topResult
      });
      
    } catch (err: any) {
      console.error('搜索失败:', err);
      setError('搜索出现错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };
  
  // 生成默认封面 - 使用通用编码工具
  const getDefaultCoverUrl = () => {
    return generateDefaultCover({
      width: 300,
      height: 300,
      text: 'M',
      color: getRandomColor(),
      fontSize: 48
    });
  };

  const getPlaceholderImage = (item: any) => {
    const text = item.title || item.name || item.artist || 'M';
    return generateDefaultCover({
      width: 92,
      height: 92,
      text: text,
      color: getRandomColor(),
      fontSize: 24
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'Artist': return '艺术家';
      case 'Song': return '歌曲';
      case 'Playlist': return '播放列表';
      default: return type;
    }
  };

  // 显示加载状态
  if (loading) {
    return (
      <NoResults>
        正在搜索 "{query}"...
      </NoResults>
    );
  }

  // 显示错误信息
  if (error) {
    return (
      <NoResults>
        {error}
      </NoResults>
    );
  }

  // 显示无结果
  if (results.songs.length === 0 && results.singers.length === 0 && results.playlists.length === 0) {
    return (
      <NoResults>
        没有找到 "{query}" 的相关结果
      </NoResults>
    );
  }

  return (
    <ResultsContainer>
      {results.topResult && (
        <Section>
          <SectionTitle>最佳匹配</SectionTitle>
          <TopResult>
            <TopResultImage $bgImage={getPlaceholderImage(results.topResult)} />
            <TopResultTitle>
              {results.topResult.title || results.topResult.name || results.topResult.artist}
            </TopResultTitle>
            <TopResultType>
              {getTypeLabel(results.topResult.type)}
            </TopResultType>
            <TopResultPlayButton className="play-button">
              <PlayCircleOutlined />
            </TopResultPlayButton>
          </TopResult>
        </Section>
      )}

      {results.songs.length > 0 && (
        <SongsSection>
          <SectionTitle>歌曲</SectionTitle>
          <SongTable 
            songs={results.songs} 
            showAlbum={true} 
            showDateAdded={false}
          />
        </SongsSection>
      )}

      {results.singers.length > 0 && (
        <Section>
          <SectionTitle>艺术家</SectionTitle>
          <PlaylistsGrid>
            {results.singers.slice(0, 6).map((singer: any) => (
              <PlaylistCard
                key={`singer-${singer.id}`}
                playlist={{
                  id: `singer-${singer.id}`,
                  name: singer.name,
                  description: `${singer.songCount || 0} 首歌曲`,
                  coverUrl: singer.picUrl ? getFullBackendUrl(singer.picUrl) : getDefaultCoverUrl(),
                  createdBy: '艺术家'
                }}
                to={`/artist/${singer.id}`}
              />
            ))}
          </PlaylistsGrid>
        </Section>
      )}

      {results.playlists.length > 0 && (
        <Section>
          <SectionTitle>播放列表</SectionTitle>
          <PlaylistsGrid>
            {results.playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={{
                  id: playlist.id,
                  name: playlist.name,
                  description: playlist.description,
                  coverUrl: playlist.coverUrl,
                  createdBy: playlist.createdBy
                }}
                to={`/playlist/${playlist.id}`}
              />
            ))}
          </PlaylistsGrid>
        </Section>
      )}
    </ResultsContainer>
  );
};

export default SearchResults;
