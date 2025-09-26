package com.music.dto;

import lombok.Data;

/**
 * 聊天响应DTO
 */
@Data
public class ChatResponseDto {
    
    /**
     * AI回复消息
     */
    private String message;
    
    /**
     * 会话ID
     */
    private String sessionId;
    
    /**
     * 响应时间戳
     */
    private Long timestamp;
    
    /**
     * 消息类型（text, music_recommendation等）
     */
    private String messageType;
    
    /**
     * 构造函数
     */
    public ChatResponseDto() {
        this.timestamp = System.currentTimeMillis();
        this.messageType = "text";
    }
    
    public ChatResponseDto(String message) {
        this();
        this.message = message;
    }
    
    public ChatResponseDto(String message, String sessionId) {
        this(message);
        this.sessionId = sessionId;
    }
}
