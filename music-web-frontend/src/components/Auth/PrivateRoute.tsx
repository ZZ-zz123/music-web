import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../../store';
import { setUser, logout } from '../../store/slices/userSlice';
import { authApi } from '../../services/api';

const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #121212 0%, #181818 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #1db954;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  margin-top: 20px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
`;

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser, isLoggedIn } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 如果已经有用户信息，直接设置为已登录
      if (currentUser) {
        setLoading(false);
        return;
      }

      try {
        // 尝试从后端获取当前用户信息（基于Session）
        const userData = await authApi.getCurrentUser();
        
        if (userData) {
          // 转换后端用户数据格式
          const userInfo = {
            id: (userData as any).id.toString(),
            username: (userData as any).username,
            email: (userData as any).email,
            avatar: (userData as any).avatar || '/avatar.jpg',
            displayName: (userData as any).nickname || (userData as any).username,
          };
          
          dispatch(setUser(userInfo));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [currentUser, dispatch]);

  // 正在检查认证状态
  if (loading) {
    return (
      <LoadingContainer>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner />
          <LoadingText>正在验证登录状态...</LoadingText>
        </div>
      </LoadingContainer>
    );
  }

  // 未登录，重定向到登录页面
  if (!isLoggedIn || !currentUser) {
    console.log('用户未登录，重定向到登录页面');
    return <Navigate to="/login" replace />;
  }

  // 已登录，渲染子组件
  return <>{children}</>;
};

export default PrivateRoute;
