import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import MixSection from '../Music/MixSection';
import Carousel from '../Common/Carousel';
import { homeCarouselData } from '../../data/carouselData';
import { 
  mockTopMixes, 
  mockMadeForYou, 
  mockRecentlyPlayed, 
  mockJumpBackIn, 
  mockUniquelyYours, 
  mockJustTheHits 
} from '../../data/mockData';
import { 
  realTopMixes, 
  realMadeForYou, 
  realRecentlyPlayed, 
  realJumpBackIn, 
  realUniquelyYours, 
  realJustTheHits 
} from '../../data/realMockData';
import { useRealSongs } from '../../hooks/useRealData';

const MainContainer = styled.div`
  flex: 1;
  background: linear-gradient(180deg, #5038a0 0%, #121212 300px);
  min-height: 100vh;
  overflow-y: auto;
`;

const ContentContainer = styled.div`
  padding: 0 32px 100px;
`;

const Greeting = styled.div`
  margin: 0 0 16px;
  
  h1 {
    font-size: 32px;
    font-weight: 900;
    color: white;
    margin: 0;
  }
`;

const QuickPlaySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 16px;
  margin-bottom: 48px;
`;

const QuickPlayCard = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const QuickPlayImage = styled.div<{ bgImage: string }>`
  width: 80px;
  height: 80px;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 4px 0 0 4px;
`;

const QuickPlayText = styled.div`
  padding: 0 16px;
  color: white;
  font-weight: 700;
  font-size: 16px;
`;

const MainContent: React.FC = () => {
  const { songs: realSongs, loading, error } = useRealSongs();
  const navigate = useNavigate();

  // 生成占位符图片
  const getQuickPlayImage = (title: string, color: string) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="${color}"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="10" font-weight="bold">${title.slice(0, 2)}</text>
      </svg>
    `)}`;
  };

  // 始终使用中文快速播放项目
  const quickPlayItems = [
    { id: 1, title: '华语流行精选', image: getQuickPlayImage('华语流行精选', '#1db954') },
    { id: 2, title: '经典港台金曲', image: getQuickPlayImage('经典港台金曲', '#8d67ab') },
    { id: 3, title: '民谣温暖时光', image: getQuickPlayImage('民谣温暖时光', '#ff6b6b') },
    { id: 4, title: 'K-POP精选集', image: getQuickPlayImage('K-POP精选集', '#00d4e6') },
    { id: 5, title: '摇滚青春记忆', image: getQuickPlayImage('摇滚青春记忆', '#e61e32') },
    { id: 6, title: '喜欢的音乐', image: getQuickPlayImage('喜欢的音乐', '#4c1bd4') },
  ];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <MainContainer>
      <Header />
      <ContentContainer>
        <Greeting>
          <h1>{getTimeGreeting()}</h1>
        </Greeting>

        {/* 首页轮播图 */}
        <div style={{ marginBottom: '24px' }}>
          <Carousel 
            items={homeCarouselData} 
            autoPlay={true} 
            interval={4000} 
          />
        </div>
        
        <QuickPlaySection>
          {quickPlayItems.map((item) => (
            <QuickPlayCard 
              key={item.id}
              onClick={() => {
                if (item.title === '喜欢的音乐') {
                  navigate('/liked');
                } else {
                  navigate('/library');
                }
              }}
            >
              <QuickPlayImage bgImage={item.image} />
              <QuickPlayText>{item.title}</QuickPlayText>
            </QuickPlayCard>
          ))}
        </QuickPlaySection>

        {loading && (
          <div style={{ textAlign: 'center', color: '#b3b3b3', marginTop: '20px' }}>
            正在加载音乐数据...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: '#ff6b6b', marginTop: '20px', marginBottom: '20px' }}>
            {error} - 使用真实推荐
          </div>
        )}

        {/* 始终使用真实推荐数据，不管是否有歌曲数据 */}
        <MixSection 
          title="你的热门音乐" 
          items={realTopMixes} 
        />
        <MixSection 
          title="为你推荐" 
          items={realMadeForYou} 
        />
        <MixSection 
          title="最近播放" 
          items={realRecentlyPlayed} 
        />
        <MixSection 
          title="重新开始" 
          items={realJumpBackIn} 
        />
        <MixSection 
          title="独特推荐" 
          items={realUniquelyYours} 
        />
        <MixSection 
          title="热门金曲" 
          items={realJustTheHits} 
        />
      </ContentContainer>
    </MainContainer>
  );
};

export default MainContent;
