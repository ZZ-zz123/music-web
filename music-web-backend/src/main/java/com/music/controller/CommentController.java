package com.music.controller;

import com.music.common.result.Result;
import com.music.dto.CommentRequestDto;
import com.music.entity.Comment;
import com.music.service.CommentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 评论控制器
 */
@Api(tags = "评论管理")
@RestController
@RequestMapping("/comments")
@CrossOrigin
@Slf4j
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    /**
     * 获取评论列表
     */
    @ApiOperation("获取评论列表")
    @GetMapping
    public Result<List<Comment>> getComments(
            @ApiParam("目标ID") @RequestParam Long targetId,
            @ApiParam("目标类型") @RequestParam String targetType,
            HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Result.error(401, "请先登录");
        }
        
        List<Comment> comments = commentService.getCommentsByTarget(targetId, targetType, userId);
        return Result.success(comments);
    }
    
    /**
     * 添加评论
     */
    @ApiOperation("添加评论")
    @PostMapping
    public Result<Comment> addComment(
            @RequestBody CommentRequestDto request,
            HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Result.error(401, "请先登录");
        }
        
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            return Result.error("评论内容不能为空");
        }
        
        if (request.getContent().length() > 500) {
            return Result.error("评论内容不能超过500字符");
        }
        
        if (request.getTargetId() == null) {
            return Result.error("目标ID不能为空");
        }
        
        if (request.getTargetType() == null || request.getTargetType().trim().isEmpty()) {
            return Result.error("目标类型不能为空");
        }
        
        try {
            Comment comment = commentService.addComment(
                userId, 
                request.getTargetId(), 
                request.getTargetType(), 
                request.getContent().trim(), 
                request.getParentId()
            );
            return Result.success(comment);
        } catch (Exception e) {
            log.error("添加评论失败", e);
            return Result.error("添加评论失败");
        }
    }
    
    /**
     * 删除评论
     */
    @ApiOperation("删除评论")
    @DeleteMapping("/{commentId}")
    public Result<Void> deleteComment(
            @ApiParam("评论ID") @PathVariable Long commentId,
            HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Result.error(401, "请先登录");
        }
        
        boolean success = commentService.deleteComment(commentId, userId);
        return success ? Result.success() : Result.error("删除评论失败");
    }
    
    /**
     * 点赞/取消点赞评论
     */
    @ApiOperation("点赞/取消点赞评论")
    @PostMapping("/{commentId}/like")
    public Result<Boolean> toggleLikeComment(
            @ApiParam("评论ID") @PathVariable Long commentId,
            HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Result.error(401, "请先登录");
        }
        
        try {
            boolean isLiked = commentService.toggleLikeComment(commentId, userId);
            return Result.success(isLiked);
        } catch (Exception e) {
            log.error("点赞操作失败", e);
            return Result.error("点赞操作失败");
        }
    }
    
    /**
     * 获取评论详情
     */
    @ApiOperation("获取评论详情")
    @GetMapping("/{commentId}")
    public Result<Comment> getCommentById(
            @ApiParam("评论ID") @PathVariable Long commentId,
            HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Result.error(401, "请先登录");
        }
        
        Comment comment = commentService.getCommentById(commentId, userId);
        return comment != null ? Result.success(comment) : Result.notFound("评论不存在");
    }
}
