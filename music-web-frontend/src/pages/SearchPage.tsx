import React, { useState } from 'react';
import styled from 'styled-components';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import Header from '../components/Layout/Header';
import RecentSearchItem from '../components/Search/RecentSearchItem';
import GenreCard from '../components/Search/GenreCard';
import CategoryCard from '../components/Search/CategoryCard';
import SearchResults from '../components/Search/SearchResults';

const SearchContainer = styled.div`
  background: linear-gradient(180deg, #1e3264 0%, #121212 300px);
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 0 32px 100px;
`;

const SearchBarContainer = styled.div`
  margin: 16px 0 32px;
  position: relative;
  max-width: 364px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 24px;
  border: none;
  background: white;
  padding: 0 48px 0 48px;
  font-size: 14px;
  outline: none;
  
  &::placeholder {
    color: #737373;
  }
`;

const SearchIcon = styled(SearchOutlined)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #737373;
  font-size: 20px;
`;

const ClearButton = styled.button<{ $visible: boolean }>`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.2s;
  
  .anticon {
    color: #737373;
    font-size: 20px;
  }
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

const RecentSearches = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TopGenres = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 48px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BrowseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const recentSearches = [
    {
      id: '1',
      name: 'The Chainsmokers',
      type: 'Artist' as const,
      imageUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#e67e22"/>
          <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="12" font-weight="bold">TC</text>
        </svg>
      `)}`
    },
    {
      id: '2',
      name: 'Ed Sheeran',
      type: 'Artist' as const,
      imageUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#3498db"/>
          <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="12" font-weight="bold">ES</text>
        </svg>
      `)}`
    }
  ];

  const topGenres = [
    {
      id: 'chinese-pop',
      name: '华语流行',
      color: '#1db954',
      imageUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="200" height="200" fill="#1db954"/>' +
        '<text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="18" font-weight="bold">华语流行</text>' +
        '</svg>'
      )
    },
    {
      id: 'k-pop',
      name: 'K-POP',
      color: '#e67e22',
      imageUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="200" height="200" fill="#e67e22"/>' +
        '<text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="20" font-weight="bold">K-POP</text>' +
        '</svg>'
      )
    }
  ];

  const browseCategories = [
    { id: 'chinese-pop', name: '华语流行', color: '#1db954' },
    { id: 'made-for-you', name: '为你推荐', color: '#1e3264' },
    { id: 'charts', name: '排行榜', color: '#8e44ad' },
    { id: 'new-releases', name: '新发布', color: '#e91e63' },
    { id: 'discover', name: '发现', color: '#674ea7' },
    { id: 'folk', name: '华语民谣', color: '#ff6b6b' },
    { id: 'k-pop', name: 'K-POP', color: '#e67e22' },
    { id: 'rock', name: '华语摇滚', color: '#e61e32' },
    { id: 'classic-hk-tw', name: '经典港台', color: '#8d67ab' },
    { id: 'western-pop', name: '欧美流行', color: '#1e3264' },
    { id: 'instrumental', name: '纯音乐', color: '#477d95' },
    { id: 'movie-music', name: '影视歌曲', color: '#7b1fa2' },
    { id: 'jay-chou', name: '周杰伦', color: '#1db954' },
    { id: 'jj-lin', name: '林俊杰', color: '#4ecdc4' },
    { id: 'mayday', name: '五月天', color: '#e61e32' },
    { id: 'iu', name: 'IU', color: '#ff8787' },
    { id: 'ballad', name: '抒情歌曲', color: '#8e44ad' },
    { id: 'beyond', name: 'Beyond', color: '#e61e32' },
    { id: 'leslie-cheung', name: '张国荣', color: '#8d67ab' },
    { id: 'eminem', name: '欧美说唱', color: '#1e3264' }
  ];

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    // 根据不同的分类ID设置对应的搜索词
    const searchTermMap: { [key: string]: string } = {
      'chinese-pop': '华语流行',
      'made-for-you': '推荐',
      'charts': '热门',
      'new-releases': '新歌',
      'folk': '民谣',
      'k-pop': 'IU',
      'rock': '五月天',
      'classic-hk-tw': '张国荣',
      'western-pop': 'Eminem',
      'instrumental': 'Yiruma',
      'movie-music': '胡歌',
      'jay-chou': '周杰伦',
      'jj-lin': '林俊杰',
      'mayday': '五月天',
      'iu': 'IU',
      'ballad': '抒情',
      'beyond': 'Beyond',
      'leslie-cheung': '张国荣',
      'eminem': 'Eminem'
    };
    
    const searchTerm = searchTermMap[categoryId] || categoryName;
    setSearchQuery(searchTerm);
  };

  const removeRecentSearch = (id: string) => {
    // TODO: 实现删除最近搜索的逻辑
    console.log('Remove recent search:', id);
  };

  return (
    <SearchContainer>
      <Header />
      <ContentContainer>
        <SearchBarContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="艺术家、歌曲或播客"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ClearButton 
            $visible={searchQuery.length > 0}
            onClick={handleClearSearch}
          >
            <CloseOutlined />
          </ClearButton>
        </SearchBarContainer>

        {searchQuery === '' && (
          <>
            <Section>
              <SectionTitle>最近搜索</SectionTitle>
              <RecentSearches>
                {recentSearches.map((item) => (
                  <RecentSearchItem
                    key={item.id}
                    item={item}
                    onRemove={() => removeRecentSearch(item.id)}
                  />
                ))}
              </RecentSearches>
            </Section>

            <Section>
              <SectionTitle>你的热门流派</SectionTitle>
              <TopGenres>
                {topGenres.map((genre) => (
                  <GenreCard 
                    key={genre.id} 
                    genre={genre} 
                    onClick={() => handleCategoryClick(genre.id, genre.name)}
                  />
                ))}
              </TopGenres>
            </Section>

            <Section>
              <SectionTitle>浏览全部</SectionTitle>
              <BrowseGrid>
                {browseCategories.map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category}
                    onClick={() => handleCategoryClick(category.id, category.name)}
                  />
                ))}
              </BrowseGrid>
            </Section>
          </>
        )}

        {searchQuery !== '' && (
          <SearchResults query={searchQuery} />
        )}
        
        {/* 空状态提示 */}
        {searchQuery === '' && (
          <Section style={{ textAlign: 'center', marginTop: '40px' }}>
            <div style={{ color: '#b3b3b3', fontSize: '16px' }}>
              在上方搜索框中输入歌曲名、艺术家或专辑名来搜索音乐
            </div>
          </Section>
        )}
      </ContentContainer>
    </SearchContainer>
  );
};

export default SearchPage;
