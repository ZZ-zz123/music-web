package com.music.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.music.common.result.Result;
import com.music.entity.User;
import com.music.mapper.UserMapper;
import com.music.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

/**
 * 用户服务实现类
 */
@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    // 邮箱正则表达式
    private static final String EMAIL_PATTERN = 
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@" +
        "(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
    
    // 密码最小长度
    private static final int MIN_PASSWORD_LENGTH = 6;
    
    @Override
    public Result<String> register(String username, String email, String password) {
        // 参数验证
        if (!StringUtils.hasText(username) || !StringUtils.hasText(email) || !StringUtils.hasText(password)) {
            return Result.error("用户名、邮箱和密码不能为空");
        }
        
        // 用户名长度验证
        if (username.length() < 3 || username.length() > 20) {
            return Result.error("用户名长度必须在3-20个字符之间");
        }
        
        // 邮箱格式验证
        if (!Pattern.matches(EMAIL_PATTERN, email)) {
            return Result.error("邮箱格式不正确");
        }
        
        // 密码长度验证
        if (password.length() < MIN_PASSWORD_LENGTH) {
            return Result.error("密码长度不能少于" + MIN_PASSWORD_LENGTH + "位");
        }
        
        // 检查用户名是否已存在
        if (isUsernameExists(username)) {
            return Result.error("用户名已存在");
        }
        
        // 检查邮箱是否已存在
        if (isEmailExists(email)) {
            return Result.error("邮箱已被注册");
        }
        
        try {
            // 创建新用户
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(encryptPassword(password));
            user.setNickname(username); // 默认昵称为用户名
            user.setStatus(1); // 正常状态
            user.setIsVip(false);
            user.setCreateTime(LocalDateTime.now());
            user.setUpdateTime(LocalDateTime.now());
            
            // 插入数据库
            int result = userMapper.insert(user);
            if (result > 0) {
                log.info("用户注册成功: {}", username);
                return Result.success("注册成功");
            } else {
                return Result.error("注册失败，请稍后重试");
            }
        } catch (Exception e) {
            log.error("用户注册异常: {}", e.getMessage(), e);
            return Result.error("注册失败，系统异常");
        }
    }
    
    @Override
    public Result<User> login(String usernameOrEmail, String password) {
        // 参数验证
        if (!StringUtils.hasText(usernameOrEmail) || !StringUtils.hasText(password)) {
            return Result.error("用户名/邮箱和密码不能为空");
        }
        
        try {
            // 查询用户
            User user = userMapper.selectByUsernameOrEmail(usernameOrEmail);
            if (user == null) {
                return Result.error("用户不存在");
            }
            
            // 检查用户状态
            if (user.getStatus() != 1) {
                return Result.error("账户已被禁用，请联系管理员");
            }
            
            // 验证密码
            String encryptedPassword = encryptPassword(password);
            if (!encryptedPassword.equals(user.getPassword())) {
                return Result.error("密码错误");
            }
            
            // 清除密码信息，不返回给前端
            user.setPassword(null);
            
            log.info("用户登录成功: {}", user.getUsername());
            return Result.success("登录成功", user);
            
        } catch (Exception e) {
            log.error("用户登录异常: {}", e.getMessage(), e);
            return Result.error("登录失败，系统异常");
        }
    }
    
    @Override
    public User getUserByUsername(String username) {
        if (!StringUtils.hasText(username)) {
            return null;
        }
        return userMapper.selectByUsername(username);
    }
    
    @Override
    public User getUserByEmail(String email) {
        if (!StringUtils.hasText(email)) {
            return null;
        }
        return userMapper.selectByEmail(email);
    }
    
    @Override
    public User getUserById(Long id) {
        if (id == null || id <= 0) {
            return null;
        }
        return userMapper.selectById(id);
    }
    
    @Override
    public Result<String> updateUser(User user) {
        if (user == null || user.getId() == null) {
            return Result.error("用户信息不能为空");
        }
        
        try {
            user.setUpdateTime(LocalDateTime.now());
            int result = userMapper.updateById(user);
            if (result > 0) {
                return Result.success("更新成功");
            } else {
                return Result.error("更新失败");
            }
        } catch (Exception e) {
            log.error("更新用户信息异常: {}", e.getMessage(), e);
            return Result.error("更新失败，系统异常");
        }
    }
    
    @Override
    public boolean isUsernameExists(String username) {
        if (!StringUtils.hasText(username)) {
            return false;
        }
        return getUserByUsername(username) != null;
    }
    
    @Override
    public boolean isEmailExists(String email) {
        if (!StringUtils.hasText(email)) {
            return false;
        }
        return getUserByEmail(email) != null;
    }
    
    /**
     * 密码加密
     */
    private String encryptPassword(String password) {
        // 使用MD5加密，实际项目中建议使用更安全的加密方式如BCrypt
        return DigestUtils.md5DigestAsHex((password + "music_salt").getBytes());
    }
}
