import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { DownOutlined, UserOutlined, SettingOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { logout } from '../../store/slices/userSlice';
import { authApi } from '../../services/api';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 32px;
  background: transparent;
  backdrop-filter: blur(20px);
  color: white;
  position: relative;
  z-index: 1000;
`;

const UserSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 2px;
  border-radius: 23px;
  background: rgba(0, 0, 0, 0.7);
  transition: background 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #1db954;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 12px;
  font-weight: bold;
  color: black;
`;

const Username = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin-right: 8px;
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 56px;
  right: 32px;
  width: 200px;
  background: #282828;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  z-index: 10000;
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  
  @media (max-width: 768px) {
    right: 16px;
    width: 180px;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #e5e5e5;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
  
  .anticon {
    margin-right: 12px;
    font-size: 16px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserDisplayName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #b3b3b3;
`;

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const userSectionRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // 检查点击是否在用户区域或下拉菜单内
      const clickedOnUserSection = userSectionRef.current && userSectionRef.current.contains(target);
      const clickedOnDropdown = dropdownRef.current && dropdownRef.current.contains(target);
      
      if (!clickedOnUserSection && !clickedOnDropdown) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleUserSectionClick = () => {
    console.log('用户区域被点击，当前状态:', isDropdownOpen);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserInfoClick = (e?: React.MouseEvent) => {
    console.log('🎯 点击用户信息，跳转到个人资料页面');
    e?.preventDefault();
    e?.stopPropagation();
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const handleProfileEdit = (e?: React.MouseEvent) => {
    console.log('🎯 点击编辑个人资料');
    e?.preventDefault();
    e?.stopPropagation();
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const handleSettings = (e?: React.MouseEvent) => {
    console.log('🎯 点击设置，跳转到设置页面');
    e?.preventDefault();
    e?.stopPropagation();
    setIsDropdownOpen(false);
    navigate('/settings');
  };

  const handleLogout = async (e?: React.MouseEvent) => {
    console.log('🎯 开始退出登录...');
    e?.preventDefault();
    e?.stopPropagation();
    setIsDropdownOpen(false);
    
    try {
      
      // 调用后端登出API
      await authApi.logout();
      console.log('后端登出成功');
      
      // 清除Redux中的用户状态
      dispatch(logout());
      console.log('清除本地状态成功');
      
      // 跳转到登录页面
      navigate('/login', { replace: true });
      console.log('跳转到登录页面');
      
    } catch (error) {
      console.error('退出登录失败:', error);
      
      // 即使API调用失败，也清除本地状态并跳转
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  return (
    <HeaderContainer>
      <div></div>
      
      <UserSection ref={userSectionRef} onClick={handleUserSectionClick}>
        <UserAvatar>
          {user?.username?.charAt(0).toUpperCase() || user?.displayName?.charAt(0).toUpperCase() || 'U'}
        </UserAvatar>
        <Username>{user?.displayName || user?.username || '用户'}</Username>
        <DownOutlined style={{ 
          fontSize: '12px', 
          transition: 'transform 0.2s ease',
          transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }} />
      </UserSection>
      
      {/* 使用Portal将下拉菜单渲染到body中，避免z-index冲突 */}
      {isDropdownOpen && console.log('🔍 下拉菜单应该可见了')}
      {createPortal(
        <DropdownMenu ref={dropdownRef} $isOpen={isDropdownOpen}>
          <DropdownItem 
            onClick={handleUserInfoClick}
            onMouseDown={() => console.log('🖱️ 用户信息区域被鼠标按下')}
            onMouseEnter={() => console.log('🖱️ 鼠标进入用户信息区域')}
          >
            <UserAvatar style={{ marginRight: '12px', width: '32px', height: '32px' }}>
              {user?.username?.charAt(0).toUpperCase() || user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </UserAvatar>
            <UserInfo>
              <UserDisplayName>{user?.displayName || user?.username || '用户'}</UserDisplayName>
              <UserEmail>{user?.email || 'user@example.com'}</UserEmail>
            </UserInfo>
          </DropdownItem>
          
          <Divider />
          
          <DropdownItem 
            onClick={handleProfileEdit}
            onMouseDown={() => console.log('🖱️ 编辑个人资料被鼠标按下')}
          >
            <EditOutlined />
            编辑个人资料
          </DropdownItem>
          
          <DropdownItem 
            onClick={handleSettings}
            onMouseDown={() => console.log('🖱️ 设置被鼠标按下')}
          >
            <SettingOutlined />
            设置
          </DropdownItem>
          
          <Divider />
          
          <DropdownItem 
            onClick={handleLogout}
            onMouseDown={() => console.log('🖱️ 退出登录被鼠标按下')}
          >
            <LogoutOutlined />
            退出登录
          </DropdownItem>
        </DropdownMenu>,
        document.body
      )}
    </HeaderContainer>
  );
};

export default Header;
