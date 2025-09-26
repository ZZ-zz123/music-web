import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div<{ $bgColor: string }>`
  background: ${props => props.$bgColor};
  border-radius: 8px;
  padding: 16px;
  height: 180px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const GenreName = styled.h3`
  color: white;
  font-size: 32px;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const GenreImage = styled.div<{ $bgImage: string }>`
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 120px;
  height: 120px;
  background-image: url(${props => props.$bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  transform: rotate(25deg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

interface GenreCardProps {
  genre: {
    id: string;
    name: string;
    color: string;
    imageUrl: string;
  };
  onClick?: () => void;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre, onClick }) => {
  const getPlaceholderImage = () => {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="120" height="120" fill="rgba(255,255,255,0.3)"/>' +
      '<text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="14" font-weight="bold">' + genre.name + '</text>' +
      '</svg>'
    );
  };

  return (
    <CardContainer $bgColor={genre.color} onClick={onClick}>
      <GenreName>{genre.name}</GenreName>
      <GenreImage $bgImage={getPlaceholderImage()} />
    </CardContainer>
  );
};

export default GenreCard;
