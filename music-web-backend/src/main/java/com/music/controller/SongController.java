package com.music.controller;

import com.music.common.result.PageResult;
import com.music.common.result.Result;
import com.music.entity.Song;
import com.music.service.SongService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 歌曲控制器
 */
@Api(tags = "歌曲管理")
@RestController
@RequestMapping("/songs")
@CrossOrigin
public class SongController {
    
    @Autowired
    private SongService songService;
    
    /**
     * 分页查询歌曲
     */
    @ApiOperation("分页查询歌曲")
    @GetMapping("/page")
    public Result<PageResult<Song>> getSongPage(
            @ApiParam("当前页") @RequestParam(defaultValue = "1") Long current,
            @ApiParam("页大小") @RequestParam(defaultValue = "10") Long size,
            @ApiParam("歌曲名称") @RequestParam(required = false) String name,
            @ApiParam("歌手ID") @RequestParam(required = false) Long singerId,
            @ApiParam("专辑ID") @RequestParam(required = false) Long albumId) {
        
        PageResult<Song> pageResult = songService.getSongPage(current, size, name, singerId, albumId);
        return Result.success(pageResult);
    }
    
    /**
     * 根据ID获取歌曲详情
     */
    @ApiOperation("获取歌曲详情")
    @GetMapping("/{id}")
    public Result<Song> getSongById(@ApiParam("歌曲ID") @PathVariable Long id) {
        Song song = songService.getSongById(id);
        return song != null ? Result.success(song) : Result.notFound("歌曲不存在");
    }
    
    /**
     * 搜索歌曲
     */
    @ApiOperation("搜索歌曲")
    @GetMapping("/search")
    public Result<List<Song>> searchSongs(
            @ApiParam("搜索关键词") @RequestParam String keyword,
            @ApiParam("限制数量") @RequestParam(defaultValue = "20") Integer limit) {
        
        List<Song> songs = songService.searchSongs(keyword, limit);
        return Result.success(songs);
    }
    
    /**
     * 获取热门歌曲
     */
    @ApiOperation("获取热门歌曲")
    @GetMapping("/hot")
    public Result<List<Song>> getHotSongs(
            @ApiParam("限制数量") @RequestParam(defaultValue = "50") Integer limit) {
        
        List<Song> songs = songService.getHotSongs(limit);
        return Result.success(songs);
    }
    
    /**
     * 根据歌手ID获取歌曲列表
     */
    @ApiOperation("根据歌手获取歌曲")
    @GetMapping("/singer/{singerId}")
    public Result<List<Song>> getSongsBySinger(@ApiParam("歌手ID") @PathVariable Long singerId) {
        List<Song> songs = songService.getSongsBySinger(singerId);
        return Result.success(songs);
    }
    
    /**
     * 播放歌曲（增加播放次数）
     */
    @ApiOperation("播放歌曲")
    @PostMapping("/{id}/play")
    public Result<Void> playSong(@ApiParam("歌曲ID") @PathVariable Long id) {
        boolean success = songService.playSong(id);
        return success ? Result.success() : Result.error("播放失败");
    }
    
    /**
     * 获取最新发布的歌曲
     */
    @ApiOperation("获取最新歌曲")
    @GetMapping("/latest")
    public Result<List<Song>> getLatestSongs(
            @ApiParam("限制数量") @RequestParam(defaultValue = "20") Integer limit) {
        
        List<Song> songs = songService.getLatestSongs(limit);
        return Result.success(songs);
    }
    
    /**
     * 获取推荐歌曲
     */
    @ApiOperation("获取推荐歌曲")
    @GetMapping("/recommend")
    public Result<List<Song>> getRecommendSongs(
            @ApiParam("用户ID") @RequestParam(required = false) Long userId,
            @ApiParam("限制数量") @RequestParam(defaultValue = "20") Integer limit) {
        
        List<Song> songs = songService.getRecommendSongs(userId, limit);
        return Result.success(songs);
    }
}
