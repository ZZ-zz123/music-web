import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { MessageOutlined, CloseOutlined, RobotOutlined } from '@ant-design/icons';
import { chatApi } from '../../services/api';

const ChatContainer = styled.div`
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10000;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const ChatButton = styled.button<{ $isOpen: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const AvatarIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const ChatWindow = styled.div<{ $isOpen: boolean }>`
  width: 350px;
  height: 500px;
  background: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: ${props => props.$isOpen ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.9)'};
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: calc(100vw - 100px);
    height: 60vh;
    position: absolute;
    right: 70px;
    top: 50%;
    transform: ${props => props.$isOpen ? 'translateY(-50%) scale(1)' : 'translateY(-50%) translateX(20px) scale(0.9)'};
  }
`;

const ChatHeader = styled.div`
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
`;

const HeaderAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
`;

const MessageList = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
  max-height: calc(500px - 180px); /* 确保有明确的高度限制 */
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
    border: 1px solid #333;
    
    &:hover {
      background: #666;
    }
  }
  
  /* 确保Firefox也有滚动条 */
  scrollbar-width: thin;
  scrollbar-color: #555 #1a1a1a;
`;

const Message = styled.div<{ $isUser?: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.$isUser 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : '#2a2a2a'};
  color: white;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap; /* 保持换行和空格 */
  overflow-wrap: break-word;
`;

const InputContainer = styled.div`
  padding: 16px;
  background: #252525;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 8px;
`;

const MessageInput = styled.input`
  flex: 1;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 10px 16px;
  color: white;
  font-size: 14px;
  outline: none;
  
  &::placeholder {
    color: #666;
  }
  
  &:focus {
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #999;
  font-size: 14px;
  line-height: 1.6;
`;

const ScrollHint = styled.div`
  position: absolute;
  bottom: 80px;
  right: 20px;
  background: rgba(29, 185, 84, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    background: rgba(29, 185, 84, 1);
    transform: scale(1.05);
  }
`;

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (messageListRef.current) {
      const { scrollHeight, clientHeight } = messageListRef.current;
      messageListRef.current.scrollTop = scrollHeight - clientHeight;
      setShowScrollHint(false);
    }
  };

  // 检查是否需要显示滚动提示
  const checkScrollPosition = () => {
    if (messageListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50; // 50px容差
      setShowScrollHint(!isAtBottom && messages.length > 3);
    }
  };

  // 当消息更新时，自动滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
        checkScrollPosition();
      }, 100); // 延迟一点确保DOM更新完成
    }
  }, [messages]);

  // 监听滚动事件
  const handleScroll = () => {
    checkScrollPosition();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // 如果是第一次打开，显示欢迎消息
    if (!isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: '你好！我是你的AI音乐助手 🎵\n\n我可以帮你：\n• 推荐歌曲和歌手\n• 解答音乐相关问题\n• 协助使用网站功能\n• 聊聊你喜欢的音乐\n\n有什么我可以帮助你的吗？',
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('发送聊天消息:', messageContent);
      
      // 调用真实的AI API
      const response = await chatApi.sendMessage(messageContent);
      console.log('AI回复:', response);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message || '抱歉，我现在有点忙，请稍后再试~',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI聊天失败:', error);
      
      // 如果API调用失败，显示友好的错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '🎵 抱歉，我现在有点忙，请稍后再试~\n\n你可以先试试：\n• 浏览网站的音乐收藏 🎶\n• 搜索你喜欢的歌手 🔍\n• 查看热门歌单 📋',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ChatContainer>
      <ChatWindow $isOpen={isOpen}>
        <ChatHeader>
          <HeaderTitle>
            <HeaderAvatar 
              src="/img/carouselPic/头像.png" 
              alt="AI Assistant"
              onError={(e) => {
                // 如果图片加载失败，用机器人图标替代
                e.currentTarget.style.display = 'none';
                const fallbackIcon = document.createElement('span');
                fallbackIcon.innerHTML = '🤖';
                fallbackIcon.style.fontSize = '18px';
                e.currentTarget.parentNode?.insertBefore(fallbackIcon, e.currentTarget);
              }}
            />
            AI音乐助手
          </HeaderTitle>
          <CloseButton onClick={() => setIsOpen(false)}>
            <CloseOutlined />
          </CloseButton>
        </ChatHeader>
        
        <ChatContent>
          <MessageList ref={messageListRef} onScroll={handleScroll}>
            {messages.length === 0 ? (
              <WelcomeMessage>
                👋 欢迎使用AI音乐助手！<br />
                我可以帮你发现更多好音乐
              </WelcomeMessage>
            ) : (
              messages.map(message => (
                <Message key={message.id} $isUser={message.isUser}>
                  {message.content}
                </Message>
              ))
            )}
            {isLoading && (
              <Message $isUser={false}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>正在思考中</span>
                  <span style={{ animation: 'pulse 1.5s infinite' }}>...</span>
                </div>
              </Message>
            )}
          </MessageList>
          
          {showScrollHint && (
            <ScrollHint onClick={scrollToBottom}>
              ↓ 滚动查看新消息
            </ScrollHint>
          )}
          
          <InputContainer>
            <MessageInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的问题..."
              disabled={isLoading}
            />
            <SendButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <MessageOutlined />
            </SendButton>
          </InputContainer>
        </ChatContent>
      </ChatWindow>
      
      <ChatButton $isOpen={isOpen} onClick={toggleChat}>
        <AvatarIcon 
          src="/img/carouselPic/头像.png" 
          alt="AI Assistant"
          onError={(e) => {
            // 如果图片加载失败，显示机器人图标
            e.currentTarget.style.display = 'none';
            const fallbackIcon = document.createElement('div');
            fallbackIcon.innerHTML = '🤖';
            fallbackIcon.style.fontSize = '24px';
            fallbackIcon.style.color = 'white';
            e.currentTarget.parentNode?.appendChild(fallbackIcon);
          }}
        />
      </ChatButton>
    </ChatContainer>
  );
};

export default ChatAssistant;
