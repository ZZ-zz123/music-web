package com.music.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.music.entity.Comment;
import com.music.mapper.CommentMapper;
import com.music.service.CommentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 评论Service实现类
 */
@Slf4j
@Service
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {
    
    @Autowired
    private CommentMapper commentMapper;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Override
    public List<Comment> getCommentsByTarget(Long targetId, String targetType, Long userId) {
        return commentMapper.getCommentsByTarget(targetId, targetType, userId);
    }
    
    @Override
    @Transactional
    public Comment addComment(Long userId, Long targetId, String targetType, String content, Long parentId) {
        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setTargetId(targetId);
        comment.setTargetType(targetType);
        comment.setContent(content);
        comment.setParentId(parentId);
        comment.setLikeCount(0);
        comment.setStatus(1);
        comment.setCreateTime(LocalDateTime.now());
        comment.setUpdateTime(LocalDateTime.now());
        
        commentMapper.insert(comment);
        
        // 返回带用户信息的评论
        return commentMapper.getCommentById(comment.getId(), userId);
    }
    
    @Override
    @Transactional
    public boolean deleteComment(Long commentId, Long userId) {
        // 检查评论是否存在且属于当前用户
        Comment comment = commentMapper.selectById(commentId);
        if (comment == null || !comment.getUserId().equals(userId)) {
            return false;
        }
        
        // 软删除：更新状态为0
        comment.setStatus(0);
        comment.setUpdateTime(LocalDateTime.now());
        return commentMapper.updateById(comment) > 0;
    }
    
    @Override
    @Transactional
    public boolean toggleLikeComment(Long commentId, Long userId) {
        try {
            // 检查用户是否已经点赞
            Boolean isLiked = commentMapper.getUserLikeStatus(commentId, userId);
            
            if (isLiked != null && isLiked) {
                // 已点赞，取消点赞
                jdbcTemplate.update(
                    "DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?",
                    commentId, userId
                );
                commentMapper.decrementLikeCount(commentId);
                return false; // 返回false表示取消点赞
            } else {
                // 未点赞，添加点赞
                jdbcTemplate.update(
                    "INSERT INTO comment_likes (comment_id, user_id, create_time) VALUES (?, ?, ?)",
                    commentId, userId, LocalDateTime.now()
                );
                commentMapper.incrementLikeCount(commentId);
                return true; // 返回true表示点赞成功
            }
        } catch (Exception e) {
            log.error("点赞操作失败: commentId={}, userId={}", commentId, userId, e);
            throw new RuntimeException("点赞操作失败");
        }
    }
    
    @Override
    public Comment getCommentById(Long commentId, Long userId) {
        return commentMapper.getCommentById(commentId, userId);
    }
}
