package com.music.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.music.entity.Singer;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * 歌手Mapper接口
 */
@Mapper
public interface SingerMapper extends BaseMapper<Singer> {
    
    /**
     * 根据名称查询歌手
     */
    @Select("SELECT * FROM singers WHERE name = #{name} LIMIT 1")
    Singer selectByName(@Param("name") String name);
}
