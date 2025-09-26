import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LeftOutlined, RightOutlined, PlayCircleOutlined } from '@ant-design/icons';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 1;
  
  @media (max-width: 768px) {
    height: 240px;
  }
`;

const SlideContainer = styled.div<{ currentIndex: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  transform: translateX(-${props => props.currentIndex * 100}%);
  transition: transform 0.5s ease-in-out;
`;

const Slide = styled.div<{ bgImage: string }>`
  flex: 0 0 100%;
  height: 100%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 32px;
  cursor: pointer;
  position: relative;
  
  &:hover .play-button {
    opacity: 1;
    transform: scale(1);
  }
`;

const SlideContent = styled.div`
  color: white;
  z-index: 2;
  max-width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const SlideTitle = styled.h2`
  font-size: 36px;
  font-weight: 900;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SlideSubtitle = styled.p`
  font-size: 16px;
  margin: 0 0 16px 0;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const SlideDescription = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
  max-width: 100%;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  
  @media (max-width: 768px) {
    font-size: 12px;
    display: none; // 在小屏幕上隐藏描述
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  right: 48px;
  transform: translateY(-50%) scale(0.8);
  width: 64px;
  height: 64px;
  background: #1db954;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: #1ed760;
    transform: translateY(-50%) scale(1.1);
  }
  
  .anticon {
    font-size: 24px;
    color: black;
    margin-left: 2px;
  }
`;

const NavButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction}: 16px;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 3;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-50%) scale(1.1);
  }
  
  .anticon {
    font-size: 18px;
  }
`;

const CarouselWrapper = styled.div`
  &:hover ${NavButton} {
    opacity: 1;
  }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
`;

const Indicator = styled.button<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: white;
    transform: scale(1.2);
  }
`;

export interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  onClick?: () => void;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ 
  items, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoPlay || isHovered || items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, items.length]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSlideClick = (item: CarouselItem) => {
    if (item.onClick) {
      item.onClick();
    }
  };

  if (items.length === 0) return null;

  return (
    <CarouselWrapper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CarouselContainer>
        <SlideContainer currentIndex={currentIndex}>
          {items.map((item, index) => (
            <Slide
              key={item.id}
              bgImage={item.image}
              onClick={() => handleSlideClick(item)}
            >
              <SlideContent>
                <SlideTitle>{item.title}</SlideTitle>
                <SlideSubtitle>{item.subtitle}</SlideSubtitle>
                <SlideDescription>{item.description}</SlideDescription>
              </SlideContent>
              <PlayButton className="play-button">
                <PlayCircleOutlined />
              </PlayButton>
            </Slide>
          ))}
        </SlideContainer>

        <NavButton direction="left" onClick={goToPrevious}>
          <LeftOutlined />
        </NavButton>
        <NavButton direction="right" onClick={goToNext}>
          <RightOutlined />
        </NavButton>

        <Indicators>
          {items.map((_, index) => (
            <Indicator
              key={index}
              active={index === currentIndex}
              onClick={() => goToSlide(index)}
            />
          ))}
        </Indicators>
      </CarouselContainer>
    </CarouselWrapper>
  );
};

export default Carousel;
