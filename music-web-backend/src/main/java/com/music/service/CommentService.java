package com.music.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.music.entity.Comment;

import java.util.List;

/**
 * 评论Service接口
 */
public interface CommentService extends IService<Comment> {
    
    /**
     * 获取评论列表
     */
    List<Comment> getCommentsByTarget(Long targetId, String targetType, Long userId);
    
    /**
     * 添加评论
     */
    Comment addComment(Long userId, Long targetId, String targetType, String content, Long parentId);
    
    /**
     * 删除评论
     */
    boolean deleteComment(Long commentId, Long userId);
    
    /**
     * 点赞/取消点赞评论
     */
    boolean toggleLikeComment(Long commentId, Long userId);
    
    /**
     * 获取评论详情
     */
    Comment getCommentById(Long commentId, Long userId);
}
