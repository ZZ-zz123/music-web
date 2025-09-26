import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  SearchOutlined, 
  BookOutlined,
  PlusOutlined,
  HeartOutlined 
} from '@ant-design/icons';

const SidebarContainer = styled.div`
  width: 240px;
  background: #121212;
  color: #b3b3b3;
  padding: 24px 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #282828;
`;

const Logo = styled.div`
  padding: 0 24px 20px;
  font-size: 24px;
  font-weight: bold;
  color: white;
`;

const NavSection = styled.div`
  margin-bottom: 32px;
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 24px;
  cursor: pointer;
  transition: color 0.2s;
  color: ${props => props.$active ? '#ffffff' : '#b3b3b3'};
  text-decoration: none;
  
  &:hover {
    color: #ffffff;
  }
  
  .anticon {
    margin-right: 16px;
    font-size: 20px;
  }
  
  span {
    font-size: 14px;
    font-weight: ${props => props.$active ? '600' : '400'};
  }
`;

const PlaylistNavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 24px;
  cursor: pointer;
  transition: color 0.2s;
  color: ${props => props.$active ? '#ffffff' : '#b3b3b3'};
  text-decoration: none;
  
  &:hover {
    color: #ffffff;
  }
  
  .anticon {
    margin-right: 16px;
    font-size: 20px;
  }
  
  span {
    font-size: 14px;
    font-weight: ${props => props.$active ? '600' : '400'};
  }
`;

const PlaylistSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
`;

const PlaylistTitle = styled.div`
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #a7a7a7;
`;

const PlaylistItem = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #b3b3b3;
  border-radius: 4px;
  margin: 2px 0;
  transition: all 0.2s;
  
  &:hover {
    color: #ffffff;
    background: #1a1a1a;
  }
`;

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: HomeOutlined, text: '首页', path: '/' },
    { icon: SearchOutlined, text: '搜索', path: '/search' },
    { icon: BookOutlined, text: '音乐库', path: '/library' },
  ];

  const playlistItems = [
    { icon: PlusOutlined, text: '创建播放列表', path: '/create-playlist' },
    { icon: HeartOutlined, text: '喜欢的音乐', path: '/liked' },
  ];

  const userPlaylists = [
    '轻松音乐',
    '热门精选',
    '我的年度歌曲 2021',
    '柔和旋律',
    '动漫 Lofi & Chillhop 音乐',
    '80 年代非洲精选节拍',
    '非洲精选节拍',
    '快乐金曲！',
    '深度专注',
    '器乐学习',
    'OST 合集',
    '怀旧老歌精选..',
    '复杂心境'
  ];

  return (
    <SidebarContainer>
      <Logo>音乐播放器</Logo>
      
      <NavSection>
        {navItems.map((item, index) => (
          <NavItem 
            key={index} 
            to={item.path}
            $active={location.pathname === item.path}
          >
            <item.icon />
            <span>{item.text}</span>
          </NavItem>
        ))}
      </NavSection>

      <NavSection>
        {playlistItems.map((item, index) => (
          <PlaylistNavItem 
            key={index}
            to={item.path}
            $active={location.pathname === item.path}
          >
            <item.icon />
            <span>{item.text}</span>
          </PlaylistNavItem>
        ))}
      </NavSection>

      <PlaylistSection>
        {userPlaylists.map((playlist, index) => (
          <PlaylistItem key={index}>
            {playlist}
          </PlaylistItem>
        ))}
      </PlaylistSection>
    </SidebarContainer>
  );
};

export default Sidebar;
