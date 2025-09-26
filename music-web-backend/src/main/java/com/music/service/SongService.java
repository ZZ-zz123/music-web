package com.music.service;

import com.music.common.result.PageResult;
import com.music.entity.Song;

import java.util.List;

/**
 * 歌曲服务接口
 */
public interface SongService {
    
    /**
     * 分页查询歌曲
     */
    PageResult<Song> getSongPage(Long current, Long size, String name, Long singerId, Long albumId);
    
    /**
     * 根据ID获取歌曲详情
     */
    Song getSongById(Long id);
    
    /**
     * 搜索歌曲
     */
    List<Song> searchSongs(String keyword, Integer limit);
    
    /**
     * 获取热门歌曲
     */
    List<Song> getHotSongs(Integer limit);
    
    /**
     * 根据歌手ID获取歌曲列表
     */
    List<Song> getSongsBySinger(Long singerId);
    
    /**
     * 播放歌曲（增加播放次数）
     */
    boolean playSong(Long id);
    
    /**
     * 获取最新发布的歌曲
     */
    List<Song> getLatestSongs(Integer limit);
    
    /**
     * 获取推荐歌曲
     */
    List<Song> getRecommendSongs(Long userId, Integer limit);
    
    /**
     * 保存歌曲
     */
    boolean saveSong(Song song);
    
    /**
     * 根据文件名解析歌曲信息
     */
    Song parseSongFromFileName(String fileName);
}
