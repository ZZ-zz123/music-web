package com.music.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.music.entity.Song;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 歌曲Mapper接口
 */
@Mapper
public interface SongMapper extends BaseMapper<Song> {
    
    /**
     * 分页查询歌曲（带歌手信息）
     */
    IPage<Song> getSongPageWithSinger(Page<Song> page, 
                                     @Param("name") String name,
                                     @Param("singerId") Long singerId,
                                     @Param("albumId") Long albumId);
    
    /**
     * 根据ID查询歌曲（带歌手信息）
     */
    @Select("SELECT s.*, singer.name as singerName, album.name as albumName " +
            "FROM songs s " +
            "LEFT JOIN singers singer ON s.singer_id = singer.id " +
            "LEFT JOIN albums album ON s.album_id = album.id " +
            "WHERE s.id = #{id} AND s.status = 1")
    Song getSongWithSingerById(@Param("id") Long id);
    
    /**
     * 根据音频URL查询歌曲
     */
    @Select("SELECT * FROM songs WHERE audio_url = #{audioUrl} LIMIT 1")
    Song selectByAudioUrl(@Param("audioUrl") String audioUrl);
    
    /**
     * 获取热门歌曲（带歌手信息）
     */
    @Select("SELECT s.*, singer.name as singerName, album.name as albumName " +
            "FROM songs s " +
            "LEFT JOIN singers singer ON s.singer_id = singer.id " +
            "LEFT JOIN albums album ON s.album_id = album.id " +
            "WHERE s.status = 1 " +
            "ORDER BY s.play_count DESC " +
            "LIMIT #{limit}")
    List<Song> getHotSongsWithSinger(@Param("limit") Integer limit);
    
    /**
     * 搜索歌曲（带歌手信息）
     */
    List<Song> searchSongsWithSinger(@Param("keyword") String keyword, 
                                   @Param("limit") Integer limit);
}
