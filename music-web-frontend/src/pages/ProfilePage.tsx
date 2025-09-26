import React, { useState } from 'react';
import styled from 'styled-components';
import { LeftOutlined, EditOutlined, SaveOutlined, CameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Header from '../components/Layout/Header';

const PageContainer = styled.div`
  background: linear-gradient(180deg, #2d5a27 0%, #121212 300px);
  min-height: 100vh;
  color: white;
`;

const ContentContainer = styled.div`
  padding: 0 32px 100px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 32px;
  padding-top: 24px;
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

const AvatarSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #1db954;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  color: black;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
`;

const AvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
  
  .anticon {
    font-size: 24px;
    color: white;
  }
`;

const ChangePhotoText = styled.span`
  font-size: 14px;
  color: #b3b3b3;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: white;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileType = styled.span`
  font-size: 14px;
  color: #b3b3b3;
  margin-bottom: 8px;
  display: block;
`;

const ProfileName = styled.h1`
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 16px 0;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const ProfileStats = styled.div`
  display: flex;
  gap: 24px;
  color: #b3b3b3;
  font-size: 14px;
`;

const FormSection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  color: white;
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  
  &::placeholder {
    color: #666;
  }
  
  &:focus {
    outline: none;
    border-color: #1db954;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &::placeholder {
    color: #666;
  }
  
  &:focus {
    outline: none;
    border-color: #1db954;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const SaveButton = styled.button`
  background: #1db954;
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1ed760;
    transform: scale(1.02);
  }
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser);
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    displayName: user?.displayName || '',
    email: user?.email || '',
    bio: '音乐爱好者，喜欢探索各种风格的音乐。',
    location: '中国',
    website: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // 这里将来会调用API保存用户信息
    console.log('保存用户信息:', formData);
    // 可以显示成功提示
    alert('个人资料已保存！');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleAvatarChange = () => {
    // 这里可以打开文件选择器或头像编辑器
    console.log('更换头像');
    alert('头像更换功能正在开发中...');
  };

  return (
    <PageContainer>
      <Header />
      <BackButton onClick={() => navigate(-1)}>
        <LeftOutlined />
      </BackButton>
      
      <ContentContainer>
        <ProfileHeader>
          <AvatarSection>
            <Avatar>
              {formData.username.charAt(0).toUpperCase()}
              <AvatarOverlay onClick={handleAvatarChange}>
                <CameraOutlined />
              </AvatarOverlay>
            </Avatar>
            <ChangePhotoText onClick={handleAvatarChange}>
              选择照片
            </ChangePhotoText>
          </AvatarSection>
          
          <ProfileInfo>
            <ProfileType>个人资料</ProfileType>
            <ProfileName>{formData.displayName}</ProfileName>
            <ProfileStats>
              <span>0 个关注者</span>
              <span>0 个正在关注</span>
              <span>15 个公开播放列表</span>
            </ProfileStats>
          </ProfileInfo>
        </ProfileHeader>

        <FormSection>
          <SectionTitle>
            <EditOutlined />
            基本信息
          </SectionTitle>
          
          <FormField>
            <Label>用户名</Label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="输入用户名"
            />
          </FormField>

          <FormField>
            <Label>显示名称</Label>
            <Input
              type="text"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="输入显示名称"
            />
          </FormField>

          <FormField>
            <Label>邮箱地址</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="输入邮箱地址"
            />
          </FormField>

          <FormField>
            <Label>个人简介</Label>
            <TextArea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="介绍一下你自己..."
            />
          </FormField>

          <FormField>
            <Label>位置</Label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="输入所在地"
            />
          </FormField>

          <FormField>
            <Label>个人网站</Label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="输入个人网站地址"
            />
          </FormField>

          <ButtonGroup>
            <SaveButton onClick={handleSave}>
              <SaveOutlined />
              保存个人资料
            </SaveButton>
            <CancelButton onClick={handleCancel}>
              取消
            </CancelButton>
          </ButtonGroup>
        </FormSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default ProfilePage;
