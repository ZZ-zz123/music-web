package com.music.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.music.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 评论Mapper接口
 */
@Mapper
public interface CommentMapper extends BaseMapper<Comment> {
    
    /**
     * 根据目标ID和类型获取评论列表（带用户信息）
     */
    List<Comment> getCommentsByTarget(@Param("targetId") Long targetId, 
                                    @Param("targetType") String targetType,
                                    @Param("userId") Long userId);
    
    /**
     * 根据评论ID获取评论详情（带用户信息）
     */
    Comment getCommentById(@Param("commentId") Long commentId, 
                          @Param("userId") Long userId);
    
    /**
     * 获取用户对评论的点赞状态
     */
    Boolean getUserLikeStatus(@Param("commentId") Long commentId, 
                             @Param("userId") Long userId);
    
    /**
     * 增加评论点赞数
     */
    int incrementLikeCount(@Param("commentId") Long commentId);
    
    /**
     * 减少评论点赞数
     */
    int decrementLikeCount(@Param("commentId") Long commentId);
}
