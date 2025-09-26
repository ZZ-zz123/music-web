import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LyricsContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 24px;
  margin: 24px 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LyricsHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
`;

const LyricsTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const LyricsToggle = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LyricsContent = styled.div<{ isExpanded: boolean }>`
  color: #b3b3b3;
  line-height: 1.6;
  font-size: 16px;
  white-space: pre-line;
  max-height: ${props => props.isExpanded ? 'none' : '200px'};
  overflow: hidden;
  position: relative;
  
  ${props => !props.isExpanded && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 50px;
      width: 100%;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
      pointer-events: none;
    }
  `}
`;

const LyricLine = styled.div<{ isTimestamp?: boolean; isActive?: boolean }>`
  margin: 8px 0;
  color: ${props => {
    if (props.isTimestamp) return '#666';
    if (props.isActive) return '#1db954';
    return '#b3b3b3';
  }};
  font-weight: ${props => props.isActive ? '500' : 'normal'};
  transition: color 0.2s ease;
  
  ${props => props.isTimestamp && `
    font-size: 14px;
    font-family: 'Courier New', monospace;
  `}
`;

const NoLyricsMessage = styled.div`
  color: #666;
  text-align: center;
  padding: 40px 20px;
  font-style: italic;
`;

const DisclaimerText = styled.div`
  color: #666;
  font-size: 12px;
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  border-radius: 4px;
`;

interface LyricsDisplayProps {
  lyrics?: string;
  currentTime?: number; // 当前播放时间，用于歌词同步（可选功能）
  songTitle?: string;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ 
  lyrics, 
  currentTime = 0, 
  songTitle 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [parsedLyrics, setParsedLyrics] = useState<Array<{
    time: number;
    text: string;
    isTimestamp: boolean;
  }>>([]);

  useEffect(() => {
    if (!lyrics) return;

    // 解析带时间戳的歌词
    const lines = lyrics.split('\n');
    const parsed = lines.map(line => {
      const timestampMatch = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\]/);
      if (timestampMatch) {
        const minutes = parseInt(timestampMatch[1]);
        const seconds = parseInt(timestampMatch[2]);
        const centiseconds = parseInt(timestampMatch[3]);
        const timeInSeconds = minutes * 60 + seconds + centiseconds / 100;
        const text = line.replace(/\[\d{2}:\d{2}\.\d{2}\]/, '').trim();
        
        return {
          time: timeInSeconds,
          text: text || line, // 如果没有文本，显示原始行
          isTimestamp: text === '', // 纯时间戳行
        };
      }
      
      return {
        time: 0,
        text: line,
        isTimestamp: false,
      };
    });

    setParsedLyrics(parsed);
  }, [lyrics]);

  if (!lyrics) {
    return (
      <LyricsContainer>
        <LyricsHeader>
          <LyricsTitle>歌词</LyricsTitle>
        </LyricsHeader>
        <NoLyricsMessage>
          暂无歌词
        </NoLyricsMessage>
      </LyricsContainer>
    );
  }

  return (
    <LyricsContainer>
      <LyricsHeader>
        <LyricsTitle>歌词</LyricsTitle>
        <LyricsToggle onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '收起' : '展开全部'}
        </LyricsToggle>
      </LyricsHeader>
      
      <LyricsContent isExpanded={isExpanded}>
        {parsedLyrics.map((lyric, index) => {
          // 简单的歌词同步逻辑（基于时间戳）
          const isActive = currentTime >= lyric.time && 
                          (index === parsedLyrics.length - 1 || currentTime < parsedLyrics[index + 1]?.time);
          
          return (
            <LyricLine 
              key={index} 
              isTimestamp={lyric.isTimestamp}
              isActive={isActive && !lyric.isTimestamp}
            >
              {lyric.text}
            </LyricLine>
          );
        })}
      </LyricsContent>

      <DisclaimerText>
        💡 注意：当前显示的是示例歌词内容。实际使用时需要获得歌词版权方的正式授权。
      </DisclaimerText>
    </LyricsContainer>
  );
};

export default LyricsDisplay;
