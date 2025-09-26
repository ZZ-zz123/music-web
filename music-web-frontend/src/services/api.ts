import axios from 'axios';

// API基础配置 - 使用代理，不需要完整URL
const API_BASE_URL = '/api';

// 获取完整的后端URL - 用于音频文件等静态资源
export const getFullBackendUrl = (path: string): string => {
  // 如果是完整URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // 在开发环境下，静态资源通过Vite代理直接使用相对路径
  if (import.meta.env.DEV) {
    return path.startsWith('/') ? path : '/' + path;
  }
  
  // 生产环境下拼接完整URL
  const baseUrl = window.location.origin + API_BASE_URL;
  return baseUrl + (path.startsWith('/') ? path : '/' + path);
};

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 支持携带cookies/session
});

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 后端返回格式: { code: 200, message: "success", data: ... }
    if (response.data.code === 200) {
      return response.data.data; // 直接返回data部分
    } else if (response.data.code === 401) {
      // 未登录，跳转到登录页面
      window.location.href = '/login';
      throw new Error('请先登录');
    } else {
      throw new Error(response.data.message || '请求失败');
    }
  },
  (error) => {
    console.error('API请求错误:', error);
    
    // 处理HTTP状态码401（未授权）
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
      throw new Error('请先登录');
    }
    
    throw error;
  }
);

// 歌曲相关API
export const songApi = {
  // 分页获取歌曲
  getSongPage: (params: {
    current?: number;
    size?: number;
    name?: string;
    singerId?: number;
  }) => api.get('/songs/page', { params }),

  // 搜索歌曲
  searchSongs: (keyword: string, limit = 20) =>
    api.get('/songs/search', { params: { keyword, limit } }),

  // 获取热门歌曲
  getHotSongs: (limit = 50) =>
    api.get('/songs/hot', { params: { limit } }),

  // 获取最新歌曲
  getLatestSongs: (limit = 20) =>
    api.get('/songs/latest', { params: { limit } }),

  // 获取推荐歌曲
  getRecommendSongs: (userId?: number, limit = 20) =>
    api.get('/songs/recommend', { params: { userId, limit } }),

  // 获取歌曲详情
  getSongById: (id: number) => api.get(`/songs/${id}`),

  // 播放歌曲
  playSong: (id: number) => api.post(`/songs/${id}/play`),

  // 根据歌手获取歌曲
  getSongsBySinger: (singerId: number) =>
    api.get(`/songs/singer/${singerId}`),

  // 根据风格获取歌曲
  getSongsByGenre: (genre: string, limit = 20) =>
    api.get('/songs/genre', { params: { genre, limit } }),

  // 根据语言获取歌曲
  getSongsByLanguage: (language: string, limit = 20) =>
    api.get('/songs/language', { params: { language, limit } }),
};

// 歌手相关API
export const singerApi = {
  // 分页获取歌手
  getSingerPage: (params: {
    current?: number;
    size?: number;
    name?: string;
  }) => api.get('/singers/page', { params }),

  // 搜索歌手
  searchSingers: (keyword: string, limit = 20) =>
    api.get('/singers/search', { params: { keyword, limit } }),

  // 获取热门歌手
  getHotSingers: (limit = 50) =>
    api.get('/singers/hot', { params: { limit } }),

  // 获取所有歌手
  getAllSingers: () => api.get('/singers/all'),

  // 获取歌手详情
  getSingerById: (id: number) => api.get(`/singers/${id}`),
};

// 评论相关API
export const commentApi = {
  // 获取评论列表
  getComments: (targetId: number, targetType: 'song' | 'playlist') =>
    api.get('/comments', { params: { targetId, targetType } }),

  // 添加评论
  addComment: (targetId: number, targetType: 'song' | 'playlist', content: string, parentId?: number) =>
    api.post('/comments', { targetId, targetType, content, parentId }),

  // 删除评论
  deleteComment: (commentId: number) =>
    api.delete(`/comments/${commentId}`),

  // 点赞/取消点赞评论
  toggleLikeComment: (commentId: number) =>
    api.post(`/comments/${commentId}/like`),

  // 获取评论详情
  getCommentById: (commentId: number) =>
    api.get(`/comments/${commentId}`),
};

// AI聊天相关API
export const chatApi = {
  // 发送聊天消息 (设置更长的超时时间)
  sendMessage: (message: string, sessionId?: string) =>
    api.post('/chat/send', { message, sessionId }, {
      timeout: 30000, // 30秒超时，AI调用需要更长时间
    }),

  // 获取聊天历史
  getChatHistory: () =>
    api.get('/chat/history'),
};

// 数据初始化API（管理员用）
export const adminApi = {
  // 初始化所有数据
  initAllData: () => api.post('/admin/data/init-all'),

  // 初始化歌手数据
  initSingers: () => api.post('/admin/data/init-singers'),

  // 初始化歌曲数据
  initSongs: () => api.post('/admin/data/init-songs'),
};

// 认证相关API
export const authApi = {
  // 用户登录
  login: (usernameOrEmail: string, password: string) => 
    api.post('/auth/login', { usernameOrEmail, password }),
  
  // 用户注册
  register: (username: string, email: string, password: string) => 
    api.post('/auth/register', { username, email, password }),
  
  // 用户退出登录
  logout: () => api.post('/auth/logout'),
  
  // 获取当前用户信息
  getCurrentUser: () => api.get('/auth/current'),
  
  // 检查用户名是否可用
  checkUsername: (username: string) => api.get(`/auth/check-username?username=${username}`),
  
  // 检查邮箱是否可用
  checkEmail: (email: string) => api.get(`/auth/check-email?email=${email}`),
  
  // 更新用户信息
  updateProfile: (user: any) => api.put('/auth/profile', user),
};

export default api;
