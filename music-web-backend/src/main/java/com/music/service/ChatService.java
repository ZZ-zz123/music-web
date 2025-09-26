package com.music.service;

import com.music.dto.ChatResponseDto;

/**
 * AI聊天服务接口
 */
public interface ChatService {
    
    /**
     * 处理用户消息
     * @param userId 用户ID
     * @param message 用户消息
     * @return AI回复
     */
    ChatResponseDto processMessage(Long userId, String message);
    
    /**
     * 获取用户聊天历史
     * @param userId 用户ID
     * @return 聊天历史
     */
    Object getChatHistory(Long userId);
}
