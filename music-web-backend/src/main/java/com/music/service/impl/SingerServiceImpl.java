package com.music.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.music.common.result.PageResult;
import com.music.entity.Singer;
import com.music.mapper.SingerMapper;
import com.music.service.SingerService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 歌手服务实现类
 */
@Service
public class SingerServiceImpl implements SingerService {
    
    @Autowired
    private SingerMapper singerMapper;
    
    @Override
    public PageResult<Singer> getSingerPage(Long current, Long size, String name) {
        Page<Singer> page = new Page<>(current, size);
        LambdaQueryWrapper<Singer> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.isNotBlank(name), Singer::getName, name)
                .eq(Singer::getStatus, 1)
                .orderByDesc(Singer::getPlayCount);
        
        IPage<Singer> result = singerMapper.selectPage(page, wrapper);
        return new PageResult<>(result.getRecords(), result.getTotal(), current, size);
    }
    
    @Override
    public Singer getSingerById(Long id) {
        return singerMapper.selectById(id);
    }
    
    @Override
    public List<Singer> searchSingers(String keyword, Integer limit) {
        LambdaQueryWrapper<Singer> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(StringUtils.isNotBlank(keyword), Singer::getName, keyword)
                .or()
                .like(StringUtils.isNotBlank(keyword), Singer::getEnglishName, keyword)
                .eq(Singer::getStatus, 1)
                .orderByDesc(Singer::getPlayCount)
                .last("LIMIT " + limit);
        
        return singerMapper.selectList(wrapper);
    }
    
    @Override
    public List<Singer> getHotSingers(Integer limit) {
        LambdaQueryWrapper<Singer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Singer::getStatus, 1)
                .orderByDesc(Singer::getPlayCount)
                .last("LIMIT " + limit);
        
        return singerMapper.selectList(wrapper);
    }
    
    @Override
    public List<Singer> getAllSingers() {
        LambdaQueryWrapper<Singer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Singer::getStatus, 1)
                .orderBy(true, true, Singer::getName);
        
        return singerMapper.selectList(wrapper);
    }
}
