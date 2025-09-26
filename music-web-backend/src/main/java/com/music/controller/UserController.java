package com.music.controller;

import com.music.common.result.Result;
import com.music.entity.User;
import com.music.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器
 */
@Slf4j
@RestController
@RequestMapping("/auth")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 用户注册
     */
    @PostMapping("/register")
    public Result<String> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");
        
        return userService.register(username, email, password);
    }
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> request, HttpSession session) {
        String usernameOrEmail = request.get("usernameOrEmail");
        String password = request.get("password");
        
        Result<User> loginResult = userService.login(usernameOrEmail, password);
        if (loginResult.getCode() == 200 && loginResult.getData() != null) {
            User user = loginResult.getData();
            session.setAttribute("userId", user.getId()); // Store user ID in session
            session.setMaxInactiveInterval(30 * 60); // Session expires in 30 minutes
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());
            userData.put("nickname", user.getNickname());
            userData.put("avatar", user.getAvatar());
            return Result.success("登录成功", userData);
        } else {
            return Result.error(loginResult.getMessage());
        }
    }
    
    /**
     * 用户退出登录
     */
    @PostMapping("/logout")
    public Result<String> logout(HttpSession session) {
        try {
            session.invalidate();
            return Result.success("退出成功");
        } catch (Exception e) {
            log.error("用户退出异常: {}", e.getMessage(), e);
            return Result.error("退出失败");
        }
    }
    
    /**
     * 获取当前登录用户信息
     */
    @GetMapping("/current")
    public Result<User> getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Result.error(401, "未登录"); // Return 401 for unauthorized
        }
        User user = userService.getById(userId);
        if (user != null) {
            user.setPassword(null); // Do not expose password
            return Result.success(user);
        } else {
            return Result.error("用户不存在");
        }
    }
    
    /**
     * 检查用户名是否可用
     */
    @GetMapping("/check-username")
    public Result<Boolean> checkUsername(@RequestParam String username) {
        boolean exists = userService.isUsernameExists(username);
        return Result.success("检查完成", !exists);
    }
    
    /**
     * 检查邮箱是否可用
     */
    @GetMapping("/check-email")
    public Result<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userService.isEmailExists(email);
        return Result.success("检查完成", !exists);
    }
    
    /**
     * 更新用户信息
     */
    @PutMapping("/profile")
    public Result<String> updateProfile(@RequestBody User user, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return Result.error("未登录");
        }
        
        // 确保只能更新当前用户的信息
        user.setId(userId);
        user.setPassword(null); // 不允许通过此接口修改密码
        
        return userService.updateUser(user);
    }
}
