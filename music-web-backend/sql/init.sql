-- 音乐网站数据库初始化脚本
-- MySQL 8.0

-- 创建数据库
CREATE DATABASE IF NOT EXISTS music_web DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE music_web;

-- 用户表
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码(加密)',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    gender TINYINT DEFAULT 0 COMMENT '性别 0-未知 1-男 2-女',
    birthday DATE COMMENT '生日',
    phone VARCHAR(20) COMMENT '手机号',
    bio TEXT COMMENT '个人简介',
    is_vip BOOLEAN DEFAULT FALSE COMMENT '是否VIP',
    status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-禁用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 歌手表
CREATE TABLE singers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '歌手名称',
    english_name VARCHAR(100) COMMENT '英文名',
    avatar VARCHAR(255) COMMENT '头像URL',
    gender TINYINT DEFAULT 0 COMMENT '性别 0-未知 1-男 2-女',
    birth_date DATE COMMENT '出生日期',
    nationality VARCHAR(50) COMMENT '国籍',
    description TEXT COMMENT '歌手简介',
    debut_date DATE COMMENT '出道时间',
    company VARCHAR(100) COMMENT '唱片公司',
    status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-禁用',
    play_count BIGINT DEFAULT 0 COMMENT '总播放次数',
    fan_count BIGINT DEFAULT 0 COMMENT '粉丝数',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_name (name),
    INDEX idx_name (name),
    INDEX idx_play_count (play_count),
    INDEX idx_fan_count (fan_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='歌手表';

-- 专辑表
CREATE TABLE albums (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL COMMENT '专辑名称',
    singer_id BIGINT NOT NULL COMMENT '歌手ID',
    cover_url VARCHAR(255) COMMENT '专辑封面',
    description TEXT COMMENT '专辑描述',
    release_date DATE COMMENT '发行日期',
    company VARCHAR(100) COMMENT '发行公司',
    genre VARCHAR(50) COMMENT '流派',
    language VARCHAR(20) COMMENT '语言',
    play_count BIGINT DEFAULT 0 COMMENT '播放次数',
    collect_count BIGINT DEFAULT 0 COMMENT '收藏次数',
    status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-禁用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_singer_id (singer_id),
    INDEX idx_name (name),
    INDEX idx_release_date (release_date),
    INDEX idx_play_count (play_count),
    FOREIGN KEY (singer_id) REFERENCES singers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='专辑表';

-- 歌曲表
CREATE TABLE songs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL COMMENT '歌曲名称',
    singer_id BIGINT NOT NULL COMMENT '歌手ID',
    album_id BIGINT COMMENT '专辑ID',
    cover_url VARCHAR(255) COMMENT '歌曲封面',
    audio_url VARCHAR(255) NOT NULL COMMENT '音频文件URL',
    lyric TEXT COMMENT '歌词',
    duration INTEGER DEFAULT 0 COMMENT '时长(秒)',
    file_size BIGINT DEFAULT 0 COMMENT '文件大小(字节)',
    format VARCHAR(10) DEFAULT 'mp3' COMMENT '文件格式',
    bitrate INTEGER DEFAULT 128 COMMENT '比特率',
    release_date DATE COMMENT '发行日期',
    genre VARCHAR(50) COMMENT '流派',
    language VARCHAR(20) COMMENT '语言',
    play_count BIGINT DEFAULT 0 COMMENT '播放次数',
    download_count BIGINT DEFAULT 0 COMMENT '下载次数',
    like_count BIGINT DEFAULT 0 COMMENT '点赞次数',
    status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-禁用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_singer_id (singer_id),
    INDEX idx_album_id (album_id),
    INDEX idx_name (name),
    INDEX idx_play_count (play_count),
    INDEX idx_like_count (like_count),
    INDEX idx_create_time (create_time),
    FOREIGN KEY (singer_id) REFERENCES singers(id) ON DELETE CASCADE,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='歌曲表';

-- 播放列表表
CREATE TABLE playlists (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL COMMENT '播放列表名称',
    user_id BIGINT NOT NULL COMMENT '创建者ID',
    cover_url VARCHAR(255) COMMENT '封面图片',
    description TEXT COMMENT '描述',
    is_public BOOLEAN DEFAULT TRUE COMMENT '是否公开',
    play_count BIGINT DEFAULT 0 COMMENT '播放次数',
    collect_count BIGINT DEFAULT 0 COMMENT '收藏次数',
    song_count INTEGER DEFAULT 0 COMMENT '歌曲数量',
    status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-禁用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_name (name),
    INDEX idx_is_public (is_public),
    INDEX idx_play_count (play_count),
    INDEX idx_create_time (create_time),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='播放列表表';

-- 播放列表歌曲关联表
CREATE TABLE playlist_songs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    playlist_id BIGINT NOT NULL COMMENT '播放列表ID',
    song_id BIGINT NOT NULL COMMENT '歌曲ID',
    sort_order INTEGER DEFAULT 0 COMMENT '排序',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_playlist_song (playlist_id, song_id),
    INDEX idx_playlist_id (playlist_id),
    INDEX idx_song_id (song_id),
    INDEX idx_sort_order (sort_order),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='播放列表歌曲关联表';

-- 用户收藏表(歌曲收藏)
CREATE TABLE user_favorites (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    song_id BIGINT NOT NULL COMMENT '歌曲ID',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_song (user_id, song_id),
    INDEX idx_user_id (user_id),
    INDEX idx_song_id (song_id),
    INDEX idx_create_time (create_time),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收藏表';

-- 播放历史表
CREATE TABLE play_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    song_id BIGINT NOT NULL COMMENT '歌曲ID',
    play_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '播放时间',
    play_duration INTEGER DEFAULT 0 COMMENT '播放时长(秒)',
    ip_address VARCHAR(45) COMMENT 'IP地址',
    user_agent TEXT COMMENT '用户代理',
    
    INDEX idx_user_id (user_id),
    INDEX idx_song_id (song_id),
    INDEX idx_play_time (play_time),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='播放历史表';

-- 评论表
CREATE TABLE comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_type VARCHAR(20) NOT NULL COMMENT '评论目标类型 song-歌曲 playlist-播放列表',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    content TEXT NOT NULL COMMENT '评论内容',
    parent_id BIGINT COMMENT '父评论ID',
    like_count INTEGER DEFAULT 0 COMMENT '点赞数',
    status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-删除',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_target (target_type, target_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_create_time (create_time),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 评论点赞表
CREATE TABLE comment_likes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    comment_id BIGINT NOT NULL COMMENT '评论ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_comment_user (comment_id, user_id),
    INDEX idx_comment_id (comment_id),
    INDEX idx_user_id (user_id),
    INDEX idx_create_time (create_time),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论点赞表';

-- 用户关注表
CREATE TABLE user_follows (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    follower_id BIGINT NOT NULL COMMENT '关注者ID',
    following_id BIGINT NOT NULL COMMENT '被关注者ID',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_follow (follower_id, following_id),
    INDEX idx_follower_id (follower_id),
    INDEX idx_following_id (following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户关注表';

-- 系统配置表
CREATE TABLE system_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    description VARCHAR(255) COMMENT '描述',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';
