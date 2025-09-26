package com.music.dto;

import lombok.Data;

/**
 * 评论请求DTO
 */
@Data
public class CommentRequestDto {
    
    /**
     * 目标ID
     */
    private Long targetId;
    
    /**
     * 目标类型
     */
    private String targetType;
    
    /**
     * 评论内容
     */
    private String content;
    
    /**
     * 父评论ID
     */
    private Long parentId;
}
