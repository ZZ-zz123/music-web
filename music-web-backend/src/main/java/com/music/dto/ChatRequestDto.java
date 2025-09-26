package com.music.dto;

import lombok.Data;

/**
 * 聊天请求DTO
 */
@Data
public class ChatRequestDto {
    
    /**
     * 用户消息内容
     */
    private String message;
    
    /**
     * 会话ID（可选，用于维持上下文）
     */
    private String sessionId;
}
