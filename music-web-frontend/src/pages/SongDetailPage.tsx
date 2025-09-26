import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  HeartOutlined,
  HeartFilled,
  DownloadOutlined,
  ShareAltOutlined,
  MoreOutlined,
  LeftOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { RootState } from '../store';
import { setCurrentSong } from '../store/slices/playerSlice';
import { audioService } from '../services/audioService';
import { songApi, getFullBackendUrl } from '../services/api';
import { Song } from '../types';
// import { generateSongCover } from '../utils/imageGenerator';
import LayoutHeader from '../components/Layout/Header';
import LyricsDisplay from '../components/Music/LyricsDisplay';
import CommentSection from '../components/Comment/CommentSection';

// 创建一个安全的Base64编码函数，支持Unicode字符
const safeBase64Encode = (str: string): string => {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
};

// 生成默认的歌曲封面占位图
const getDefaultCoverUrl = (): string => {
  const svg = `<svg width="320" height="320" xmlns="http://www.w3.org/2000/svg">
    <rect width="320" height="320" fill="#404040"/>
    <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="24">Music</text>
  </svg>`;
  return `data:image/svg+xml;base64,${safeBase64Encode(svg)}`;
};

const PageContainer = styled.div`
  background: linear-gradient(180deg, #5038a0 0%, #121212 300px);
  min-height: 100vh;
  color: white;
`;

const Header = styled.div`
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.05);
  }
`;

const ContentContainer = styled.div`
  padding: 0 32px 100px;
`;

const SongInfo = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const CoverImage = styled.div<{ $imageUrl: string }>`
  width: 320px;
  height: 320px;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    width: 280px;
    height: 280px;
    margin: 0 auto;
  }
`;

const InfoPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 24px;
`;

const SongType = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: #b3b3b3;
`;

const SongTitle = styled.h1`
  font-size: 72px;
  font-weight: 900;
  margin: 0 0 24px 0;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const SongMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #b3b3b3;
  
  a {
    color: white;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 48px;
`;

const MainPlayButton = styled.button`
  background: #1db954;
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  .anticon {
    font-size: 24px;
    color: black;
  }
  
  &:hover {
    transform: scale(1.05);
    background: #1ed760;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  .anticon {
    font-size: 24px;
    color: #b3b3b3;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    
    .anticon {
      color: white;
    }
  }
  
  &.liked .anticon {
    color: #1db954;
  }
`;

// 移除旧的歌词相关样式组件，现在使用 LyricsDisplay 组件

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #b3b3b3;
`;

const SongDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const currentSong = useSelector((state: RootState) => state.player.currentSong);
  const isPlaying = useSelector((state: RootState) => state.player.isPlaying);
  
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSongDetail(id);
    }
  }, [id]);

  const fetchSongDetail = async (songId: string) => {
    try {
      setLoading(true);
      console.log('🔍 获取歌曲详情，ID:', songId);
      
      // 调用真实的API获取歌曲详情
      const response: any = await songApi.getSongById(parseInt(songId));
      console.log('📝 歌曲详情API响应:', JSON.stringify(response, null, 2));
      
      if (response) {
        // 转换后端数据格式为前端格式
        const transformedSong: Song = {
          id: response.id.toString(),
          title: response.name,
          artist: response.singerName || '未知歌手',
          album: response.albumName || '未知专辑',
          duration: response.duration || 0,
          coverUrl: response.coverUrl ? getFullBackendUrl(response.coverUrl) : getDefaultCoverUrl(),
          audioUrl: getFullBackendUrl(response.audioUrl),
          dateAdded: response.createTime ? response.createTime.split(' ')[0] : undefined,
          lyrics: response.lyric || undefined, // 添加歌词字段
        };
        
        console.log('🎵 转换后的歌曲数据:', transformedSong);
        setSong(transformedSong);
      } else {
        console.error('❌ 未找到歌曲数据');
        setError('歌曲不存在');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ 获取歌曲详情失败:', error);
      setError('获取歌曲详情失败');
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!song) return;
    
    if (currentSong?.id === song.id) {
      // 如果是当前歌曲，切换播放状态
      audioService.togglePlayPause();
    } else {
      // 如果是新歌曲，开始播放
      audioService.playSong(song);
      dispatch(setCurrentSong(song));
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // 这里可以调用API更新喜欢状态
  };

  const handleDownload = () => {
    if (song?.audioUrl) {
      // audioUrl 已经是完整URL，可以直接使用
      window.open(song.audioUrl, '_blank');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatPlayCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <LeftOutlined />
          </BackButton>
        </Header>
        <ContentContainer>
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <div style={{ color: '#b3b3b3', fontSize: '18px' }}>正在加载歌曲信息...</div>
          </div>
        </ContentContainer>
      </PageContainer>
    );
  }

  if (!song) {
    return (
      <PageContainer>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <LeftOutlined />
          </BackButton>
        </Header>
        <ContentContainer>
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <div style={{ color: '#ff6b6b', fontSize: '18px' }}>
              {error || '歌曲不存在'}
            </div>
          </div>
        </ContentContainer>
      </PageContainer>
    );
  }

  const isCurrentSong = currentSong?.id === song.id;
  const showPauseIcon = isCurrentSong && isPlaying;

  return (
    <PageContainer>
      <LayoutHeader />
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <LeftOutlined />
        </BackButton>
      </Header>
      
      <ContentContainer>
        <SongInfo>
          <CoverImage $imageUrl={song.coverUrl} />
          <InfoPanel>
            <SongType>歌曲</SongType>
            <SongTitle>{song.title}</SongTitle>
            <SongMeta>
              <a href={`/artist/${song.artist}`}>{song.artist}</a>
              <span>•</span>
              <a href={`/album/${song.album}`}>{song.album}</a>
              <span>•</span>
              <span>2003</span>
              <span>•</span>
              <span>{formatDuration(song.duration)}</span>
            </SongMeta>
          </InfoPanel>
        </SongInfo>

        <Controls>
          <MainPlayButton onClick={handlePlayPause}>
            {showPauseIcon ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          </MainPlayButton>
          
          <ActionButton 
            className={isLiked ? 'liked' : ''} 
            onClick={handleLike}
          >
            {isLiked ? <HeartFilled /> : <HeartOutlined />}
          </ActionButton>
          
          <ActionButton onClick={handleDownload}>
            <DownloadOutlined />
          </ActionButton>
          
          <ActionButton onClick={() => setShowComments(!showComments)}>
            <MessageOutlined />
          </ActionButton>
          
          <ActionButton>
            <ShareAltOutlined />
          </ActionButton>
          
          <ActionButton>
            <MoreOutlined />
          </ActionButton>
        </Controls>

        {/* 使用新的歌词显示组件 */}
        <LyricsDisplay 
          lyrics={song.lyrics} 
          currentTime={0} 
          songTitle={song.title}
        />

        {/* 评论区组件 */}
        <CommentSection
          targetId={song.id}
          targetType="song"
          isVisible={showComments}
          onClose={() => setShowComments(false)}
        />

        <StatsSection>
          <StatCard>
            <StatNumber>{formatPlayCount(3240567)}</StatNumber>
            <StatLabel>播放次数</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{formatPlayCount(124589)}</StatNumber>
            <StatLabel>喜欢数</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{formatPlayCount(8763)}</StatNumber>
            <StatLabel>下载数</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>2003</StatNumber>
            <StatLabel>发行年份</StatLabel>
          </StatCard>
        </StatsSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default SongDetailPage;
