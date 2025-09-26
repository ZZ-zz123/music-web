package com.music.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 歌手实体
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("singers")
public class Singer {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 歌手名称
     */
    private String name;
    
    /**
     * 英文名
     */
    private String englishName;
    
    /**
     * 头像URL
     */
    private String avatar;
    
    /**
     * 性别 0-未知 1-男 2-女
     */
    private Integer gender;
    
    /**
     * 出生日期
     */
    private LocalDate birthDate;
    
    /**
     * 国籍
     */
    private String nationality;
    
    /**
     * 歌手简介
     */
    private String description;
    
    /**
     * 出道时间
     */
    private LocalDate debutDate;
    
    /**
     * 唱片公司
     */
    private String company;
    
    /**
     * 状态 1-正常 0-禁用
     */
    private Integer status;
    
    /**
     * 总播放次数
     */
    private Long playCount;
    
    /**
     * 粉丝数
     */
    private Long fanCount;
    
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
}
