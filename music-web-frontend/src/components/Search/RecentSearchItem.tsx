import React from 'react';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  background: #2a2a2a;
  border-radius: 24px;
  padding: 8px 8px 8px 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #3a3a3a;
  }
`;

const ItemImage = styled.div<{ $bgImage: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-image: url(${props => props.$bgImage});
  background-size: cover;
  background-position: center;
  margin-right: 12px;
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemType = styled.div`
  color: #b3b3b3;
  font-size: 12px;
  margin-top: 2px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .anticon {
    color: #b3b3b3;
    font-size: 16px;
  }
  
  &:hover .anticon {
    color: white;
  }
`;

interface RecentSearchItemProps {
  item: {
    id: string;
    name: string;
    type: 'Artist' | 'Song' | 'Album' | 'Playlist';
    imageUrl: string;
  };
  onRemove: () => void;
}

const RecentSearchItem: React.FC<RecentSearchItemProps> = ({ item, onRemove }) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'Artist': return '艺术家';
      case 'Song': return '歌曲';
      case 'Album': return '专辑';
      case 'Playlist': return '播放列表';
      default: return type;
    }
  };

  return (
    <ItemContainer>
      <ItemImage $bgImage={item.imageUrl} />
      <ItemInfo>
        <ItemName>{item.name}</ItemName>
        <ItemType>{getTypeLabel(item.type)}</ItemType>
      </ItemInfo>
      <RemoveButton onClick={handleRemove}>
        <CloseOutlined />
      </RemoveButton>
    </ItemContainer>
  );
};

export default RecentSearchItem;
