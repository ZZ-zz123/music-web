import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MessageOutlined, LikeOutlined, LikeFilled, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Comment, CommentRequest } from '../../types';
import { RootState } from '../../store';
import { commentApi } from '../../services/api';

const CommentContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 24px;
  margin: 24px 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  .anticon {
    margin-right: 8px;
    color: #1db954;
  }
`;

const CommentTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const CommentCount = styled.span`
  color: #b3b3b3;
  margin-left: 8px;
  font-size: 14px;
`;

const CommentInput = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1db954;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: black;
  flex-shrink: 0;
`;

const InputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  padding: 12px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &::placeholder {
    color: #666;
  }
  
  &:focus {
    outline: none;
    border-color: #1db954;
  }
`;

const InputActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const SendButton = styled.button`
  background: #1db954;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1ed760;
  }
  
  &:disabled {
    background: #333;
    cursor: not-allowed;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const Username = styled.span`
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const CommentTime = styled.span`
  color: #666;
  font-size: 12px;
`;

const CommentText = styled.p`
  color: #e5e5e5;
  margin: 0 0 12px 0;
  font-size: 14px;
  line-height: 1.4;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #b3b3b3;
  }
  
  &.liked {
    color: #1db954;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
`;

interface CommentSectionProps {
  targetId: string;
  targetType: 'song' | 'playlist';
  isVisible: boolean;
  onClose: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  targetId,
  targetType,
  isVisible,
  onClose
}) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取评论数据
  const loadComments = async () => {
    if (!isVisible) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('获取评论:', { targetId, targetType });
      
      const response = await commentApi.getComments(parseInt(targetId), targetType);
      console.log('评论数据:', response);
      
      // 转换后端数据格式为前端格式
      const transformedComments: Comment[] = (response || []).map((item: any) => ({
        id: item.id.toString(),
        userId: item.userId.toString(),
        username: item.username || item.nickname || '用户',
        userAvatar: item.userAvatar,
        content: item.content,
        createTime: item.createTime,
        likeCount: item.likeCount || 0,
        isLiked: item.isLiked || false,
      }));
      
      setComments(transformedComments);
    } catch (err: any) {
      console.error('获取评论失败:', err);
      setError('获取评论失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [isVisible, targetId, targetType]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      console.log('提交评论:', { targetId: parseInt(targetId), targetType, content: newComment.trim() });
      
      const response = await commentApi.addComment(parseInt(targetId), targetType, newComment.trim());
      console.log('评论提交成功:', response);
      
      // 重新加载评论列表
      await loadComments();
      setNewComment('');
    } catch (error: any) {
      console.error('提交评论失败:', error);
      setError('提交评论失败，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      console.log('点赞评论:', commentId);
      
      const response = await commentApi.toggleLikeComment(parseInt(commentId));
      console.log('点赞结果:', response);
      
      // 本地更新评论状态
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          const newIsLiked = response; // 后端返回最新的点赞状态
          return {
            ...comment,
            isLiked: newIsLiked,
            likeCount: newIsLiked 
              ? comment.likeCount + (comment.isLiked ? 0 : 1)
              : comment.likeCount - (comment.isLiked ? 1 : 0)
          };
        }
        return comment;
      }));
    } catch (error: any) {
      console.error('点赞操作失败:', error);
      setError('点赞操作失败，请稍后再试');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    
    try {
      console.log('删除评论:', commentId);
      
      await commentApi.deleteComment(parseInt(commentId));
      console.log('评论删除成功');
      
      // 从列表中移除该评论
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error: any) {
      console.error('删除评论失败:', error);
      setError('删除评论失败，请稍后再试');
    }
  };

  const formatTime = (timeStr: string) => {
    const now = new Date();
    const commentTime = new Date(timeStr);
    const diffMs = now.getTime() - commentTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}天前`;
    } else if (diffHours > 0) {
      return `${diffHours}小时前`;
    } else {
      return '刚刚';
    }
  };

  if (!isVisible) return null;

  return (
    <CommentContainer>
      <CommentHeader>
        <MessageOutlined />
        <CommentTitle>评论</CommentTitle>
        <CommentCount>({comments.length}条评论)</CommentCount>
      </CommentHeader>

      {error && (
        <div style={{ 
          background: 'rgba(220, 53, 69, 0.1)', 
          border: '1px solid rgba(220, 53, 69, 0.3)',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          color: '#dc3545'
        }}>
          {error}
        </div>
      )}

      <CommentInput>
        <UserAvatar>
          {user?.displayName?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
        </UserAvatar>
        <InputContainer>
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            maxLength={500}
            disabled={submitting}
          />
          <InputActions>
            <SendButton
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
            >
              <SendOutlined />
              {submitting ? '发布中...' : '发布'}
            </SendButton>
          </InputActions>
        </InputContainer>
      </CommentInput>

      <CommentList>
        {loading ? (
          <EmptyState>加载评论中...</EmptyState>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem key={comment.id}>
              <UserAvatar>
                {comment.username.charAt(0).toUpperCase()}
              </UserAvatar>
              <CommentContent>
                <CommentMeta>
                  <Username>{comment.username}</Username>
                  <CommentTime>{formatTime(comment.createTime)}</CommentTime>
                </CommentMeta>
                <CommentText>{comment.content}</CommentText>
                <CommentActions>
                  <ActionButton
                    onClick={() => handleLikeComment(comment.id)}
                    className={comment.isLiked ? 'liked' : ''}
                  >
                    {comment.isLiked ? <LikeFilled /> : <LikeOutlined />}
                    {comment.likeCount}
                  </ActionButton>
                  {comment.userId === user?.id?.toString() && (
                    <ActionButton
                      onClick={() => handleDeleteComment(comment.id)}
                      style={{ color: '#dc3545' }}
                    >
                      <DeleteOutlined />
                      删除
                    </ActionButton>
                  )}
                </CommentActions>
              </CommentContent>
            </CommentItem>
          ))
        ) : (
          <EmptyState>
            暂无评论，来写下第一条评论吧！
          </EmptyState>
        )}
      </CommentList>
    </CommentContainer>
  );
};

export default CommentSection;
