package com.music.service;

import com.music.common.result.PageResult;
import com.music.entity.Singer;

import java.util.List;

/**
 * 歌手服务接口
 */
public interface SingerService {
    
    /**
     * 分页查询歌手
     */
    PageResult<Singer> getSingerPage(Long current, Long size, String name);
    
    /**
     * 根据ID获取歌手详情
     */
    Singer getSingerById(Long id);
    
    /**
     * 搜索歌手
     */
    List<Singer> searchSingers(String keyword, Integer limit);
    
    /**
     * 获取热门歌手
     */
    List<Singer> getHotSingers(Integer limit);
    
    /**
     * 获取所有歌手
     */
    List<Singer> getAllSingers();
}
