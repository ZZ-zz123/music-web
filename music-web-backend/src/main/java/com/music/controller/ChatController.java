package com.music.controller;

import com.music.common.result.Result;
import com.music.dto.ChatRequestDto;
import com.music.dto.ChatResponseDto;
import com.music.service.ChatService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * AI聊天控制器
 */
@Api(tags = "AI聊天管理")
@RestController
@RequestMapping("/chat")
@CrossOrigin
@Slf4j
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    /**
     * 发送聊天消息
     */
    @ApiOperation("发送聊天消息")
    @PostMapping("/send")
    public Result<ChatResponseDto> sendMessage(
            @RequestBody ChatRequestDto request,
            HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Result.error(401, "请先登录");
        }
        
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return Result.error("消息内容不能为空");
        }
        
        if (request.getMessage().length() > 1000) {
            return Result.error("消息内容不能超过1000字符");
        }
        
        try {
            log.info("用户 {} 发送聊天消息: {}", userId, request.getMessage());
            
            ChatResponseDto response = chatService.processMessage(userId, request.getMessage().trim());
            return Result.success(response);
        } catch (Exception e) {
            log.error("处理聊天消息失败", e);
            return Result.error("处理消息失败，请稍后再试");
        }
    }
    
    /**
     * 获取聊天历史
     */
    @ApiOperation("获取聊天历史")
    @GetMapping("/history")
    public Result<Object> getChatHistory(HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Result.error(401, "请先登录");
        }
        
        try {
            // 暂时返回空历史，后续可以扩展
            return Result.success("聊天历史功能待开发");
        } catch (Exception e) {
            log.error("获取聊天历史失败", e);
            return Result.error("获取聊天历史失败");
        }
    }
}
