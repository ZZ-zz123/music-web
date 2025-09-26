package com.music.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.music.common.result.Result;
import com.music.entity.User;

/**
 * 用户服务接口
 */
public interface UserService extends IService<User> {
    
    /**
     * 用户注册
     */
    Result<String> register(String username, String email, String password);
    
    /**
     * 用户登录
     */
    Result<User> login(String usernameOrEmail, String password);
    
    /**
     * 根据用户名查询用户
     */
    User getUserByUsername(String username);
    
    /**
     * 根据邮箱查询用户
     */
    User getUserByEmail(String email);
    
    /**
     * 根据ID查询用户
     */
    User getUserById(Long id);
    
    /**
     * 更新用户信息
     */
    Result<String> updateUser(User user);
    
    /**
     * 检查用户名是否已存在
     */
    boolean isUsernameExists(String username);
    
    /**
     * 检查邮箱是否已存在
     */
    boolean isEmailExists(String email);
}
