import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { authApi } from '../services/api';
import { setUser } from '../store/slices/userSlice';

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/img/carouselPic/login.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const LoginCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    margin: 20px;
    padding: 32px 24px;
    max-width: none;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const LogoText = styled.h1`
  color: #1db954;
  font-size: 32px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -1px;
`;

const WelcomeText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  margin: 8px 0 0 0;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  padding: 0 16px 0 48px;
  transition: all 0.2s ease;
  box-sizing: border-box;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #1db954;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  height: 48px;
  background: #1db954;
  border: none;
  border-radius: 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
  
  &:hover {
    background: #1ed760;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #535353;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
`;

const SuccessMessage = styled.div`
  color: #1db954;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  
  span {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    margin: 0 16px;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  
  a {
    color: #1db954;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.usernameOrEmail.trim() || !formData.password.trim()) {
      setError('请填写完整的登录信息');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authApi.login(formData.usernameOrEmail, formData.password);
      
      // 登录成功，保存用户信息到Redux
      const userData = {
        id: response.id.toString(),
        username: response.username,
        email: response.email,
        avatar: response.avatar || '/avatar.jpg',
        displayName: response.nickname || response.username,
      };
      
      dispatch(setUser(userData));
      setSuccess('登录成功！正在跳转...');
      
      // 延迟跳转，让用户看到成功消息
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (err: any) {
      console.error('登录失败:', err);
      setError(err.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <LogoText>Music</LogoText>
          <WelcomeText>欢迎回来，开始你的音乐之旅</WelcomeText>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>用户名或邮箱</Label>
            <InputContainer>
              <InputIcon>
                <UserOutlined />
              </InputIcon>
              <Input
                type="text"
                placeholder="请输入用户名或邮箱"
                value={formData.usernameOrEmail}
                onChange={(e) => handleInputChange('usernameOrEmail', e.target.value)}
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label>密码</Label>
            <InputContainer>
              <InputIcon>
                <LockOutlined />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </PasswordToggle>
            </InputContainer>
          </InputGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </LoginButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>

        <Divider>
          <span>或</span>
        </Divider>

        <RegisterLink>
          还没有账户？<a href="#" onClick={handleRegisterClick}>立即注册</a>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
