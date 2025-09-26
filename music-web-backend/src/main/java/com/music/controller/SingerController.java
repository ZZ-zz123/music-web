package com.music.controller;

import com.music.common.result.PageResult;
import com.music.common.result.Result;
import com.music.entity.Singer;
import com.music.service.SingerService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 歌手控制器
 */
@Api(tags = "歌手管理")
@RestController
@RequestMapping("/singers")
@CrossOrigin
public class SingerController {
    
    @Autowired
    private SingerService singerService;
    
    /**
     * 分页查询歌手
     */
    @ApiOperation("分页查询歌手")
    @GetMapping("/page")
    public Result<PageResult<Singer>> getSingerPage(
            @ApiParam("当前页") @RequestParam(defaultValue = "1") Long current,
            @ApiParam("页大小") @RequestParam(defaultValue = "10") Long size,
            @ApiParam("歌手名称") @RequestParam(required = false) String name) {
        
        PageResult<Singer> pageResult = singerService.getSingerPage(current, size, name);
        return Result.success(pageResult);
    }
    
    /**
     * 根据ID获取歌手详情
     */
    @ApiOperation("获取歌手详情")
    @GetMapping("/{id}")
    public Result<Singer> getSingerById(@ApiParam("歌手ID") @PathVariable Long id) {
        Singer singer = singerService.getSingerById(id);
        return singer != null ? Result.success(singer) : Result.notFound("歌手不存在");
    }
    
    /**
     * 搜索歌手
     */
    @ApiOperation("搜索歌手")
    @GetMapping("/search")
    public Result<List<Singer>> searchSingers(
            @ApiParam("搜索关键词") @RequestParam String keyword,
            @ApiParam("限制数量") @RequestParam(defaultValue = "20") Integer limit) {
        
        List<Singer> singers = singerService.searchSingers(keyword, limit);
        return Result.success(singers);
    }
    
    /**
     * 获取热门歌手
     */
    @ApiOperation("获取热门歌手")
    @GetMapping("/hot")
    public Result<List<Singer>> getHotSingers(
            @ApiParam("限制数量") @RequestParam(defaultValue = "50") Integer limit) {
        
        List<Singer> singers = singerService.getHotSingers(limit);
        return Result.success(singers);
    }
    
    /**
     * 获取所有歌手（用于下拉选择）
     */
    @ApiOperation("获取所有歌手")
    @GetMapping("/all")
    public Result<List<Singer>> getAllSingers() {
        List<Singer> singers = singerService.getAllSingers();
        return Result.success(singers);
    }
}
