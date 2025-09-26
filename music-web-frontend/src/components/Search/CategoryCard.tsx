import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div<{ $bgColor: string }>`
  background: ${props => props.$bgColor};
  border-radius: 8px;
  height: 180px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const CategoryName = styled.h3`
  color: white;
  font-size: 16px;
  font-weight: 900;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
`;

const CategoryImage = styled.div<{ $bgColor: string }>`
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transform: rotate(25deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
    background: white;
    border-radius: 4px;
    opacity: 0.8;
  }
`;

const DecorativeElement = styled.div`
  position: absolute;
  top: -20px;
  right: -20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
`;

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    color: string;
  };
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <CardContainer $bgColor={category.color} onClick={onClick}>
      <CategoryName>{category.name}</CategoryName>
      <CategoryImage $bgColor={category.color} />
      <DecorativeElement />
    </CardContainer>
  );
};

export default CategoryCard;
