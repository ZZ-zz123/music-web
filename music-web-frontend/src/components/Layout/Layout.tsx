import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import PlayerBar from '../Player/PlayerBar';
import ChatAssistant from '../Chat/ChatAssistant';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #000000;
  color: white;
  font-family: 'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 90px; /* 为底部播放栏留出空间 */
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainArea>
        <ContentArea>
          {children}
        </ContentArea>
      </MainArea>
      <PlayerBar />
      <ChatAssistant />
    </LayoutContainer>
  );
};

export default Layout;
