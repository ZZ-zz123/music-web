package com.music.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.music.common.result.PageResult;
import com.music.entity.Song;
import com.music.entity.Singer;
import com.music.mapper.SongMapper;
import com.music.mapper.SingerMapper;
import com.music.service.SongService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 歌曲服务实现类
 */
@Service
public class SongServiceImpl implements SongService {
    
    @Autowired
    private SongMapper songMapper;
    
    @Autowired
    private SingerMapper singerMapper;
    
    @Override
    public PageResult<Song> getSongPage(Long current, Long size, String name, Long singerId, Long albumId) {
        Page<Song> page = new Page<>(current, size);
        IPage<Song> result = songMapper.getSongPageWithSinger(page, name, singerId, albumId);
        
        return new PageResult<>(result.getRecords(), result.getTotal(), current, size);
    }
    
    @Override
    public Song getSongById(Long id) {
        return songMapper.getSongWithSingerById(id);
    }
    
    @Override
    public List<Song> searchSongs(String keyword, Integer limit) {
        if (keyword == null || keyword.trim().isEmpty()) {
            // 如果没有搜索关键词，返回热门歌曲
            return songMapper.getHotSongsWithSinger(limit);
        }
        
        // 使用真正的搜索功能
        return songMapper.searchSongsWithSinger(keyword.trim(), limit);
    }
    
    @Override
    public List<Song> getHotSongs(Integer limit) {
        return songMapper.getHotSongsWithSinger(limit);
    }
    
    @Override
    public List<Song> getSongsBySinger(Long singerId) {
        LambdaQueryWrapper<Song> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Song::getSingerId, singerId)
                .eq(Song::getStatus, 1)
                .orderByDesc(Song::getCreateTime);
        
        return songMapper.selectList(wrapper);
    }
    
    @Override
    public boolean playSong(Long id) {
        Song song = songMapper.selectById(id);
        if (song != null) {
            song.setPlayCount(song.getPlayCount() + 1);
            return songMapper.updateById(song) > 0;
        }
        return false;
    }
    
    @Override
    public List<Song> getLatestSongs(Integer limit) {
        LambdaQueryWrapper<Song> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Song::getStatus, 1)
                .orderByDesc(Song::getCreateTime)
                .last("LIMIT " + limit);
        
        return songMapper.selectList(wrapper);
    }
    
    @Override
    public List<Song> getRecommendSongs(Long userId, Integer limit) {
        // 简单推荐逻辑：返回播放量高的歌曲
        // 实际项目中可以根据用户喜好、播放历史等进行智能推荐
        return getHotSongs(limit);
    }
    
    @Override
    public boolean saveSong(Song song) {
        return songMapper.insert(song) > 0;
    }
    
    @Override
    public Song parseSongFromFileName(String fileName) {
        // 解析文件名格式：歌手名-歌曲名.扩展名
        // 例如：周杰伦-七里香.mp3
        
        if (StringUtils.isBlank(fileName)) {
            return null;
        }
        
        // 去掉文件扩展名
        String nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1);
        
        // 按照"-"分割
        String[] parts = nameWithoutExtension.split("-", 2);
        if (parts.length != 2) {
            return null;
        }
        
        String singerName = parts[0].trim();
        String songName = parts[1].trim();
        
        // 查找或创建歌手
        Singer singer = getOrCreateSinger(singerName);
        
        // 创建歌曲对象
        Song song = new Song();
        song.setName(songName);
        song.setSingerId(singer.getId());
        song.setAudioUrl("/song/" + fileName);
        song.setFormat(extension.toLowerCase());
        song.setStatus(1);
        song.setPlayCount(0L);
        song.setDownloadCount(0L);
        song.setLikeCount(0L);
        
        return song;
    }
    
    /**
     * 获取或创建歌手
     */
    private Singer getOrCreateSinger(String singerName) {
        LambdaQueryWrapper<Singer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Singer::getName, singerName);
        Singer singer = singerMapper.selectOne(wrapper);
        
        if (singer == null) {
            singer = new Singer();
            singer.setName(singerName);
            singer.setStatus(1);
            singer.setPlayCount(0L);
            singer.setFanCount(0L);
            
            // 设置头像（如果存在对应的歌手图片）
            String avatarUrl = "/singerPic/" + singerName + ".jpg";
            singer.setAvatar(avatarUrl);
            
            singerMapper.insert(singer);
        }
        
        return singer;
    }
}
