package com.music.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 歌曲实体
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("songs")
public class Song {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 歌曲名称
     */
    private String name;
    
    /**
     * 歌手ID
     */
    private Long singerId;
    
    /**
     * 专辑ID
     */
    private Long albumId;
    
    /**
     * 歌曲封面
     */
    private String coverUrl;
    
    /**
     * 音频文件URL
     */
    private String audioUrl;
    
    /**
     * 歌词
     */
    private String lyric;
    
    /**
     * 时长(秒)
     */
    private Integer duration;
    
    /**
     * 文件大小(字节)
     */
    private Long fileSize;
    
    /**
     * 文件格式
     */
    private String format;
    
    /**
     * 比特率
     */
    private Integer bitrate;
    
    /**
     * 发行日期
     */
    private LocalDate releaseDate;
    
    /**
     * 流派
     */
    private String genre;
    
    /**
     * 语言
     */
    private String language;
    
    /**
     * 播放次数
     */
    private Long playCount;
    
    /**
     * 下载次数
     */
    private Long downloadCount;
    
    /**
     * 点赞次数
     */
    private Long likeCount;
    
    /**
     * 状态 1-正常 0-禁用
     */
    private Integer status;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    // 关联字段
    /**
     * 歌手名称
     */
    @TableField(exist = false)
    private String singerName;
    
    /**
     * 专辑名称
     */
    @TableField(exist = false)
    private String albumName;
}
