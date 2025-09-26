import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { authApi } from '../services/api';

const RegisterContainer = styled.div`
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

const RegisterCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    margin: 20px;
    padding: 32px 24px;
    max-width: none;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;
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

const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.error ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)'};
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
    border-color: ${props => props.error ? '#ff6b6b' : '#1db954'};
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

const ValidationMessage = styled.div<{ type: 'error' | 'success' | 'info' }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${props => {
    switch (props.type) {
      case 'error': return '#ff6b6b';
      case 'success': return '#1db954';
      case 'info': return 'rgba(255, 255, 255, 0.6)';
    }
  }};
`;

const RegisterButton = styled.button`
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

const LoginLink = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  
  a {
    color: #1db954;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = '用户名不能为空';
        } else if (value.length < 3) {
          newErrors.username = '用户名长度不能少于3位';
        } else if (value.length > 20) {
          newErrors.username = '用户名长度不能超过20位';
        } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) {
          newErrors.username = '用户名只能包含字母、数字、下划线和中文';
        } else {
          delete newErrors.username;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = '邮箱不能为空';
        } else if (!emailRegex.test(value)) {
          newErrors.email = '邮箱格式不正确';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = '密码不能为空';
        } else if (value.length < 6) {
          newErrors.password = '密码长度不能少于6位';
        } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
          newErrors.password = '密码必须包含字母和数字';
        } else {
          delete newErrors.password;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = '请确认密码';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = '两次输入的密码不一致';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证所有字段
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field as keyof typeof formData]);
    });

    // 检查是否有错误
    if (Object.keys(errors).length > 0) {
      setError('请修正表单中的错误');
      return;
    }

    // 检查必填字段
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('请填写完整的注册信息');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authApi.register(formData.username, formData.email, formData.password);
      
      setSuccess('注册成功！正在跳转到登录页面...');
      
      // 延迟跳转到登录页面
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err: any) {
      console.error('注册失败:', err);
      setError(err.message || '注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>
          <LogoText>Music</LogoText>
          <WelcomeText>加入音乐世界，发现无限可能</WelcomeText>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>用户名</Label>
            <InputContainer>
              <InputIcon>
                <UserOutlined />
              </InputIcon>
              <Input
                type="text"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                error={!!errors.username}
              />
            </InputContainer>
            {errors.username && (
              <ValidationMessage type="error">{errors.username}</ValidationMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>邮箱</Label>
            <InputContainer>
              <InputIcon>
                <MailOutlined />
              </InputIcon>
              <Input
                type="email"
                placeholder="请输入邮箱地址"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!errors.email}
              />
            </InputContainer>
            {errors.email && (
              <ValidationMessage type="error">{errors.email}</ValidationMessage>
            )}
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
                error={!!errors.password}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </PasswordToggle>
            </InputContainer>
            {errors.password && (
              <ValidationMessage type="error">{errors.password}</ValidationMessage>
            )}
            {!errors.password && formData.password && (
              <ValidationMessage type="info">
                密码强度：{formData.password.length >= 8 ? '强' : '中'}
              </ValidationMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>确认密码</Label>
            <InputContainer>
              <InputIcon>
                <LockOutlined />
              </InputIcon>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={!!errors.confirmPassword}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </PasswordToggle>
            </InputContainer>
            {errors.confirmPassword && (
              <ValidationMessage type="error">{errors.confirmPassword}</ValidationMessage>
            )}
          </InputGroup>

          <RegisterButton type="submit" disabled={loading || Object.keys(errors).length > 0}>
            {loading ? '注册中...' : '注册'}
          </RegisterButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
        </Form>

        <Divider>
          <span>或</span>
        </Divider>

        <LoginLink>
          已有账户？<a onClick={handleLoginClick}>立即登录</a>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPage;
