package com.music.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

/**
 * 评论实体
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("comments")
public class Comment {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 目标ID（歌曲ID或歌单ID）
     */
    private Long targetId;
    
    /**
     * 目标类型（song, playlist）
     */
    private String targetType;
    
    /**
     * 评论内容
     */
    private String content;
    
    /**
     * 父评论ID（用于回复）
     */
    private Long parentId;
    
    /**
     * 点赞数
     */
    private Integer likeCount;
    
    /**
     * 状态（1-正常，0-删除）
     */
    private Integer status;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    // 非数据库字段 - 用于查询时关联用户信息
    @TableField(exist = false)
    private String username;
    
    @TableField(exist = false)
    private String userAvatar;
    
    @TableField(exist = false)
    private Boolean isLiked;
}
