import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, CameraOutlined } from '@ant-design/icons';
import Header from '../components/Layout/Header';

const PageContainer = styled.div`
  background: linear-gradient(180deg, #2d5a27 0%, #121212 300px);
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  padding: 0 32px 100px;
  max-width: 600px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin: 24px 0;
  
  &:hover {
    color: white;
  }
  
  .anticon {
    font-size: 16px;
  }
`;

const CreateForm = styled.div`
  background: #282828;
  border-radius: 8px;
  padding: 32px;
  margin-top: 24px;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
`;

const ImageUpload = styled.div`
  width: 180px;
  height: 180px;
  background: #181818;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #1a1a1a;
  }
`;

const CameraIcon = styled(CameraOutlined)`
  font-size: 48px;
  color: #b3b3b3;
  margin-bottom: 16px;
`;

const UploadText = styled.span`
  color: #b3b3b3;
  font-size: 14px;
  text-align: center;
`;

const FormFields = styled.div`
  flex: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  color: white;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  background: #3e3e3e;
  border: none;
  border-radius: 4px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: background 0.2s;
  
  &:focus {
    background: #4a4a4a;
  }
  
  &::placeholder {
    color: #b3b3b3;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: #3e3e3e;
  border: none;
  border-radius: 4px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 100px;
  transition: background 0.2s;
  font-family: inherit;
  
  &:focus {
    background: #4a4a4a;
  }
  
  &::placeholder {
    color: #b3b3b3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 32px;
  border-radius: 24px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #1db954;
    color: black;
    
    &:hover {
      background: #1ed760;
      transform: scale(1.04);
    }
    
    &:disabled {
      background: #535353;
      color: #b3b3b3;
      cursor: not-allowed;
      transform: none;
    }
  ` : `
    background: transparent;
    color: #b3b3b3;
    border: 1px solid #727272;
    
    &:hover {
      color: white;
      border-color: white;
    }
  `}
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 900;
  color: white;
  margin: 0;
`;

const CreatePlaylistPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    
    // TODO: 实际创建播放列表的逻辑
    console.log('Creating playlist:', formData);
    
    // 创建成功后跳转到音乐库
    navigate('/library');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <BackButton onClick={handleCancel}>
          <ArrowLeftOutlined />
          返回
        </BackButton>
        
        <Title>创建播放列表</Title>
        
        <CreateForm>
          <FormHeader>
            <ImageUpload>
              <CameraIcon />
              <UploadText>选择照片</UploadText>
            </ImageUpload>
            
            <FormFields>
              <FormGroup>
                <Label>名称</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="我的播放列表 #1"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>描述</Label>
                <TextArea
                  name="description"
                  placeholder="添加可选的描述"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </FormFields>
          </FormHeader>
          
          <ButtonGroup>
            <Button variant="secondary" onClick={handleCancel}>
              取消
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              创建
            </Button>
          </ButtonGroup>
        </CreateForm>
      </ContentContainer>
    </PageContainer>
  );
};

export default CreatePlaylistPage;
