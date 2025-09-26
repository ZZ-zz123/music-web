import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MixCard } from '../../types';
import MixCardComponent from './MixCard';

const SectionContainer = styled.div`
  margin-bottom: 48px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0;
`;

const ShowAllButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const CardsGrid = styled.div`
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

interface MixSectionProps {
  title: string;
  items: MixCard[];
  showAll?: boolean;
}

const MixSection: React.FC<MixSectionProps> = ({ title, items, showAll = true }) => {
  const navigate = useNavigate();

  const handleCardClick = (item: MixCard) => {
    // 根据不同类型导航到不同页面
    switch (item.type) {
      case 'playlist':
        navigate(`/playlist/${item.id}`);
        break;
      case 'mix':
      case 'album':
        navigate(`/playlist/${item.id}`);
        break;
      case 'genre-mix':
      case 'artist-mix':
        navigate(`/search?genre=${encodeURIComponent(item.genre || item.title)}`);
        break;
      case 'recently-played':
      case 'continue-listening':
        navigate('/library');
        break;
      default:
        navigate(`/playlist/${item.id}`);
    }
  };

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        {showAll && <ShowAllButton>查看全部</ShowAllButton>}
      </SectionHeader>
      <CardsGrid>
        {items.map((item) => (
          <MixCardComponent 
            key={item.id} 
            mixCard={item} 
            onClick={() => handleCardClick(item)}
          />
        ))}
      </CardsGrid>
    </SectionContainer>
  );
};

export default MixSection;
