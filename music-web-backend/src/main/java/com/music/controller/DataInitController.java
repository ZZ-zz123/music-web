package com.music.controller;

import com.music.common.result.Result;
import com.music.service.DataInitService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 数据初始化控制器
 */
@Api(tags = "数据初始化")
@RestController
@RequestMapping("/admin/data")
@CrossOrigin
public class DataInitController {
    
    @Autowired
    private DataInitService dataInitService;
    
    /**
     * 初始化所有数据
     */
    @ApiOperation("初始化所有数据")
    @PostMapping("/init-all")
    public Result<String> initAllData() {
        try {
            dataInitService.initAllData();
            return Result.success("数据初始化成功");
        } catch (Exception e) {
            return Result.error("数据初始化失败: " + e.getMessage());
        }
    }
    
    /**
     * 初始化歌手数据
     */
    @ApiOperation("初始化歌手数据")
    @PostMapping("/init-singers")
    public Result<String> initSingers() {
        try {
            dataInitService.initSingers();
            return Result.success("歌手数据初始化成功");
        } catch (Exception e) {
            return Result.error("歌手数据初始化失败: " + e.getMessage());
        }
    }
    
    /**
     * 初始化歌曲数据
     */
    @ApiOperation("初始化歌曲数据")
    @PostMapping("/init-songs")
    public Result<String> initSongs() {
        try {
            dataInitService.initSongs();
            return Result.success("歌曲数据初始化成功");
        } catch (Exception e) {
            return Result.error("歌曲数据初始化失败: " + e.getMessage());
        }
    }
}
