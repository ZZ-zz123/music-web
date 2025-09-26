import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  LeftOutlined, 
  SoundOutlined, 
  GlobalOutlined, 
  EyeOutlined, 
  BellOutlined, 
  LockOutlined, 
  DeleteOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';

const PageContainer = styled.div`
  background: linear-gradient(180deg, #1a1a1a 0%, #121212 200px);
  min-height: 100vh;
  color: white;
`;

const ContentContainer = styled.div`
  padding: 0 32px 100px;
`;

const BackButton = styled.button`
  position: fixed;
  top: 24px;
  left: 32px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const SettingsHeader = styled.div`
  padding: 24px 0;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  margin: 0;
  color: white;
`;

const SettingsSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0;
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const SettingDescription = styled.div`
  color: #b3b3b3;
  font-size: 14px;
`;

const SettingValue = styled.div`
  color: #b3b3b3;
  font-size: 14px;
  min-width: 100px;
  text-align: right;
`;

const Toggle = styled.div<{ enabled: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: ${props => props.enabled ? '#1db954' : '#535353'};
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.enabled ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    transition: left 0.2s ease;
  }
`;

const Slider = styled.div`
  width: 200px;
  height: 4px;
  background: #535353;
  border-radius: 2px;
  position: relative;
  cursor: pointer;
`;

const SliderFill = styled.div<{ percentage: number }>`
  width: ${props => props.percentage}%;
  height: 100%;
  background: #1db954;
  border-radius: 2px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: -6px;
    top: -4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #1db954;
  }
  
  option {
    background: #282828;
    color: white;
  }
`;

const DangerButton = styled.button`
  background: #e22134;
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: #b91828;
  }
`;

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    audioQuality: 'high',
    volume: 80,
    notifications: true,
    autoplay: true,
    showExplicitContent: false,
    language: 'zh-CN',
    theme: 'dark',
    crossfade: false,
    normalization: true,
    showFriendActivity: true
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSliderChange = (key: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('确定要删除账户吗？此操作无法撤销。');
    if (confirmed) {
      alert('账户删除功能正在开发中...');
    }
  };

  return (
    <PageContainer>
      <Header />
      <BackButton onClick={() => navigate(-1)}>
        <LeftOutlined />
      </BackButton>
      
      <ContentContainer>
        <SettingsHeader>
          <PageTitle>设置</PageTitle>
        </SettingsHeader>

        {/* 音频设置 */}
        <SettingsSection>
          <SectionHeader>
            <SectionTitle>
              <SoundOutlined />
              音频设置
            </SectionTitle>
          </SectionHeader>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel>音质</SettingLabel>
              <SettingDescription>选择音频播放质量</SettingDescription>
            </SettingInfo>
            <Select
              value={settings.audioQuality}
              onChange={(e) => handleSelectChange('audioQuality', e.target.value)}
            >
              <option value="low">标准（96kbps）</option>
              <option value="medium">高品质（160kbps）</option>
              <option value="high">极高品质（320kbps）</option>
            </Select>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel>音量均衡</SettingLabel>
              <SettingDescription>为所有歌曲设置相似的音量级别</SettingDescription>
            </SettingInfo>
            <Toggle 
              enabled={settings.normalization}
              onClick={() => handleToggle('normalization')}
            />
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel>淡入淡出</SettingLabel>
              <SettingDescription>在歌曲之间进行淡入淡出</SettingDescription>
            </SettingInfo>
            <Toggle 
              enabled={settings.crossfade}
              onClick={() => handleToggle('crossfade')}
            />
          </SettingItem>
        </SettingsSection>

        {/* 播放设置 */}
        <SettingsSection>
          <SectionHeader>
            <SectionTitle>
              <CheckOutlined />
              播放设置
            </SectionTitle>
          </SectionHeader>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel>自动播放</SettingLabel>
              <SettingDescription>播放列表结束后继续播放推荐音乐</SettingDescription>
            </SettingInfo>
            <Toggle 
              enabled={settings.autoplay}
              onClick={() => handleToggle('autoplay')}
            />
          </SettingItem>
        </SettingsSection>

        {/* 显示设置 */}
        <SettingsSection>
          <SectionHeader>
            <SectionTitle>
              <EyeOutlined />
              显示设置
            </SectionTitle>
          </SectionHeader>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel>语言</SettingLabel>
              <SettingDescription>选择应用程序语言</SettingDescription>
            </SettingInfo>
            <Select
              value={settings.language}
              onChange={(e) => handleSelectChange('language', e.target.value)}
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
            </Select>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel>显示限制级内容</SettingLabel>
              <SettingDescription>允许播放带有明确歌词标签的音乐</SettingDescription>
            </SettingInfo>
            <Toggle 
              enabled={settings.showExplicitContent}
              onClick={() => handleToggle('showExplicitContent')}
            />
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel>好友动态</SettingLabel>
              <SettingDescription>在右侧显示好友正在收听的音乐</SettingDescription>
            </SettingInfo>
            <Toggle 
              enabled={settings.showFriendActivity}
              onClick={() => handleToggle('showFriendActivity')}
            />
          </SettingItem>
        </SettingsSection>

        {/* 通知设置 */}
        <SettingsSection>
          <SectionHeader>
            <SectionTitle>
              <BellOutlined />
              通知设置
            </SectionTitle>
          </SectionHeader>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel>推送通知</SettingLabel>
              <SettingDescription>接收新音乐推荐和活动通知</SettingDescription>
            </SettingInfo>
            <Toggle 
              enabled={settings.notifications}
              onClick={() => handleToggle('notifications')}
            />
          </SettingItem>
        </SettingsSection>

        {/* 账户设置 */}
        <SettingsSection>
          <SectionHeader>
            <SectionTitle>
              <LockOutlined />
              账户与隐私
            </SectionTitle>
          </SectionHeader>
          
          <SettingItem onClick={() => navigate('/profile')}>
            <SettingInfo>
              <SettingLabel>编辑个人资料</SettingLabel>
              <SettingDescription>修改用户名、头像等信息</SettingDescription>
            </SettingInfo>
            <SettingValue>〉</SettingValue>
          </SettingItem>

          <SettingItem>
            <SettingInfo>
              <SettingLabel>隐私设置</SettingLabel>
              <SettingDescription>管理个人信息的可见性</SettingDescription>
            </SettingInfo>
            <SettingValue>〉</SettingValue>
          </SettingItem>
        </SettingsSection>

        {/* 危险区域 */}
        <SettingsSection>
          <SectionHeader>
            <SectionTitle>
              <DeleteOutlined />
              危险区域
            </SectionTitle>
          </SectionHeader>
          
          <SettingItem>
            <SettingInfo>
              <SettingLabel>删除账户</SettingLabel>
              <SettingDescription>永久删除你的账户和所有数据</SettingDescription>
            </SettingInfo>
            <DangerButton onClick={handleDeleteAccount}>
              删除账户
            </DangerButton>
          </SettingItem>
        </SettingsSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default SettingsPage;
