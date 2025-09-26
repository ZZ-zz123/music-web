/**
 * 编码工具函数
 * 解决btoa()不能处理Unicode字符的问题
 */

/**
 * 安全的base64编码函数
 * @param str 要编码的字符串
 * @returns base64编码后的字符串
 */
export const safeBase64Encode = (str: string): string => {
  try {
    // 先用encodeURIComponent编码Unicode字符，再转换为Latin1字符
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch (error) {
    console.warn('Base64编码失败，使用fallback方案:', error);
    // 如果仍然失败，移除所有非ASCII字符再编码
    const fallbackStr = str.replace(/[^\x00-\x7F]/g, "");
    return btoa(fallbackStr);
  }
};

/**
 * 生成默认的SVG封面
 * @param options 配置选项
 * @returns data URL格式的SVG图片
 */
export const generateDefaultCover = (options: {
  width?: number;
  height?: number;
  text?: string;
  color?: string;
  fontSize?: number;
} = {}) => {
  const {
    width = 300,
    height = 300,
    text = 'M',
    color = '#4ecdc4',
    fontSize = 48
  } = options;
  
  // 确保文本是安全的ASCII字符
  const safeText = text.replace(/[^\x00-\x7F]/g, "M").charAt(0) || 'M';
  
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial" font-size="${fontSize}" font-weight="bold">${safeText}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${safeBase64Encode(svgContent)}`;
};

/**
 * 生成随机颜色
 * @returns 十六进制颜色值
 */
export const getRandomColor = (): string => {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
    '#fd79a8', '#6c5ce7', '#a29bfe', '#74b9ff', '#0984e3',
    '#00b894', '#e17055', '#fdcb6e', '#f39c12', '#e74c3c'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
