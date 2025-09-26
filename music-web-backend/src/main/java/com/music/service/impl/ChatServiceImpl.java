package com.music.service.impl;

import com.music.dto.ChatResponseDto;
import com.music.service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * AI聊天服务实现类
 */
@Slf4j
@Service
public class ChatServiceImpl implements ChatService {
    
    @Value("${deepseek.api.url:https://api.deepseek.com/v1/chat/completions}")
    private String deepseekApiUrl;
    
    @Value("${deepseek.api.key:}")
    private String deepseekApiKey;
    
    @Value("${deepseek.model:deepseek-chat}")
    private String deepseekModel;
    
    private final RestTemplate restTemplate;
    
    public ChatServiceImpl() {
        // 配置RestTemplate的超时设置
        this.restTemplate = new RestTemplate();
        
        // 由于DeepSeek API可能需要较长时间响应，这里使用默认配置
        // 如果需要自定义超时，可以通过HttpComponentsClientHttpRequestFactory配置
    }
    
    // 音乐专题系统提示词
    private static final String MUSIC_SYSTEM_PROMPT = 
        "你是一个专业的AI音乐助手，名字叫\"小音\"。你专门为音乐爱好者提供帮助和建议。\n\n" +
        "你的主要职责包括：\n" +
        "1. 推荐歌曲和歌手 - 根据用户喜好推荐合适的音乐\n" +
        "2. 解答音乐知识 - 回答关于音乐理论、音乐历史、乐器等问题\n" +
        "3. 分析音乐风格 - 帮助用户了解不同音乐类型和特点\n" +
        "4. 协助使用网站功能 - 指导用户如何使用音乐网站的各种功能\n" +
        "5. 音乐情感分析 - 根据心情推荐合适的音乐\n\n" +
        "回答要求：\n" +
        "- 保持友好、专业的音乐助手形象\n" +
        "- 回答要简洁明了，重点突出\n" +
        "- 多使用音乐相关的表情符号和术语\n" +
        "- 如果不确定某个音乐信息，要诚实说明\n" +
        "- 优先推荐华语、欧美、日韩等主流音乐\n" +
        "- 可以询问用户的音乐偏好来提供更精准的建议\n\n" +
        "回复风格：\n" +
        "- 使用中文回复\n" +
        "- 语气轻松友好，带有音乐的热情\n" +
        "- 每次回复控制在200字以内\n" +
        "- 可以适当使用音乐符号如🎵🎶🎤🎸等\n\n" +
        "如果用户问的不是音乐相关问题，要礼貌地引导回音乐话题。";
    
    @Override
    public ChatResponseDto processMessage(Long userId, String message) {
        log.info("处理用户 {} 的消息: {}", userId, message);
        
        try {
            // 检查DeepSeek API配置
            if (deepseekApiKey == null || deepseekApiKey.trim().isEmpty()) {
                log.info("DeepSeek API密钥未配置，使用智能模拟回复，用户: {}", userId);
                return createMockResponse(message);
            }
            
            log.info("调用DeepSeek API，用户: {}, 消息长度: {}", userId, message.length());
            
            // 调用DeepSeek API
            String aiResponse = callDeepSeekApi(message);
            
            ChatResponseDto response = new ChatResponseDto(aiResponse);
            response.setSessionId(generateSessionId(userId));
            
            log.info("DeepSeek API调用成功，用户: {}, 回复长度: {}", userId, aiResponse.length());
            return response;
            
        } catch (Exception e) {
            log.warn("DeepSeek API调用失败，使用智能模拟回复，用户: {}, 错误: {}", userId, e.getMessage());
            return createMockResponse(message);
        }
    }
    
    /**
     * 调用DeepSeek API
     */
    private String callDeepSeekApi(String userMessage) {
        try {
            // 构建请求体
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", deepseekModel);
            requestBody.put("max_tokens", 500);
            requestBody.put("temperature", 0.7);
            requestBody.put("stream", false);
            
            // 构建消息列表
            List<Map<String, String>> messages = new ArrayList<>();
            
            // 系统提示词
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", MUSIC_SYSTEM_PROMPT);
            messages.add(systemMessage);
            
            // 用户消息
            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", userMessage);
            messages.add(userMsg);
            
            requestBody.put("messages", messages);
            
            // 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(deepseekApiKey);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // 发送请求
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                deepseekApiUrl, 
                HttpMethod.POST, 
                request, 
                (Class<Map<String, Object>>) (Class<?>) Map.class
            );
            
            // 解析响应
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                if (responseBody != null) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                
                    if (choices != null && !choices.isEmpty()) {
                        Map<String, Object> firstChoice = choices.get(0);
                        @SuppressWarnings("unchecked")
                        Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                        return (String) message.get("content");
                    }
                }
            }
            
            throw new RuntimeException("DeepSeek API返回格式异常");
            
        } catch (Exception e) {
            log.error("调用DeepSeek API异常", e);
            throw e;
        }
    }
    
    /**
     * 创建模拟回复（当API未配置时）
     */
    private ChatResponseDto createMockResponse(String message) {
        String response;
        
        if (message.contains("推荐") || message.contains("歌曲") || message.contains("音乐")) {
            response = "🎵 根据你的喜好，我推荐几首经典歌曲：\n\n" +
                     "• 《夜曲》- 周杰伦 🎹\n" +
                     "• 《告白气球》- 周杰伦 🎈\n" +
                     "• 《稻香》- 周杰伦 🌾\n\n" +
                     "这些都是华语流行音乐的经典之作，你可以在网站上搜索试听！";
        } else if (message.contains("心情") || message.contains("情感")) {
            response = "🎶 音乐确实能治愈心灵！告诉我你现在的心情，我来为你推荐合适的音乐：\n\n" +
                     "😊 开心 → 推荐轻快的流行歌曲\n" +
                     "😢 难过 → 推荐温暖的治愈系音乐\n" +
                     "😌 放松 → 推荐轻柔的民谣或古典\n" +
                     "💪 励志 → 推荐节奏感强的摇滚或电子音乐";
        } else if (message.contains("功能") || message.contains("怎么用")) {
            response = "🎤 让我来介绍网站的主要功能：\n\n" +
                     "• 🔍 搜索：在顶部搜索框输入歌名或歌手\n" +
                     "• ❤️ 收藏：点击心形图标收藏喜欢的歌曲\n" +
                     "• 📋 歌单：创建和管理你的个人歌单\n" +
                     "• 💬 评论：在歌曲页面分享你的想法\n\n" +
                     "有什么具体操作不明白的，随时问我！";
        } else {
            response = "🎵 你好！我是你的AI音乐助手小音~\n\n" +
                     "我可以帮你：\n" +
                     "• 推荐歌曲和歌手 🎤\n" +
                     "• 解答音乐相关问题 🎼\n" +
                     "• 指导网站功能使用 💻\n" +
                     "• 根据心情推荐音乐 💕\n\n" +
                     "有什么音乐问题想问我吗？";
        }
        
        return new ChatResponseDto(response);
    }
    
    /**
     * 创建失败回复
     */
    private ChatResponseDto createFallbackResponse() {
        String response = "🎵 抱歉，我现在有点忙，请稍后再试~\n\n" +
                         "不过我可以先为你推荐几个网站功能：\n" +
                         "• 浏览热门歌曲 🔥\n" +
                         "• 查看推荐歌单 📋\n" +
                         "• 搜索你喜欢的音乐 🔍";
        
        return new ChatResponseDto(response);
    }
    
    /**
     * 生成会话ID
     */
    private String generateSessionId(Long userId) {
        return "session_" + userId + "_" + System.currentTimeMillis();
    }
    
    @Override
    public Object getChatHistory(Long userId) {
        // 暂时返回空，后续可以实现聊天历史功能
        return new ArrayList<>();
    }
}
