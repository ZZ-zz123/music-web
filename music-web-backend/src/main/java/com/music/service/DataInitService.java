package com.music.service;

import com.music.entity.Song;
import com.music.entity.Singer;
import com.music.mapper.SongMapper;
import com.music.mapper.SingerMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * 数据初始化服务
 * 用于导入现有的音频文件和图片资源
 */
@Slf4j
@Service
public class DataInitService {
    
    @Autowired
    private SongMapper songMapper;
    
    @Autowired
    private SingerMapper singerMapper;
    
    @Value("${file.upload.path}")
    private String uploadPath;
    
    @Value("${file.upload.domain}")
    private String domain;
    
    // 歌手分类映射 - 根据实际data文件夹中的歌手
    private final Map<String, String> singerGenreMap = new HashMap<String, String>() {{
        // 华语流行天王
        put("周杰伦", "华语流行");
        put("林俊杰", "华语流行");
        put("王力宏", "华语流行");
        put("张杰", "华语流行");
        put("许嵩", "华语流行");
        
        // 华语经典
        put("王菲", "华语经典");
        put("陈奕迅", "华语流行");
        put("张国荣", "经典港台");
        put("李克勤", "经典港台");
        
        // 华语民谣/新民谣
        put("李荣浩", "华语民谣");
        put("毛不易", "华语民谣");
        put("朴树", "华语民谣");
        put("杨宗纬", "华语民谣");
        
        // 华语摇滚
        put("五月天", "华语摇滚");
        put("Beyond", "华语摇滚");
        
        // 华语女声
        put("田馥甄", "华语流行");
        put("张碧晨", "华语流行");
        put("G.E.M.邓紫棋", "华语流行");
        put("邓紫棋", "华语流行");
        
        // 韩流
        put("IU", "韩流");
        put("金泰妍", "韩流");
        put("艺声", "韩流");
        put("林允儿", "韩流");
        put("梁耀燮", "韩流");
        put("少女时代", "韩流");
        
        // 欧美流行
        put("Eminem", "欧美说唱");
        put("Celine Dion", "欧美流行");
        put("Álvaro Soler", "欧美流行");
        
        // 电影配乐/纯音乐
        put("Ennio Morricone", "电影配乐");
        put("Yiruma", "纯音乐");
        put("The Piano Guys", "纯音乐");
        
        // 其他
        put("胡歌", "影视歌曲");
        put("成龙", "影视歌曲");
    }};
    
    // 根据歌曲名识别类型
    private String detectSongGenre(String songName, String singerName) {
        String baseName = singerName.replace("G.E.M.", "").trim();
        String baseGenre = singerGenreMap.getOrDefault(singerName, 
                          singerGenreMap.getOrDefault(baseName, "流行"));
        
        // 根据歌曲名特征进一步分类
        String lowerSongName = songName.toLowerCase();
        if (lowerSongName.contains("ballad") || songName.contains("慢") || 
            songName.contains("伤") || songName.contains("想你") || 
            songName.contains("眼泪") || songName.contains("孤单")) {
            return "抒情";
        } else if (lowerSongName.contains("rock") || songName.contains("摇滚") || 
                  songName.contains("倔强") || songName.contains("叛逆")) {
            return "摇滚";
        } else if (songName.contains("舞") || songName.contains("节拍") || 
                  lowerSongName.contains("dance")) {
            return "舞曲";
        } else if (songName.contains("乡") || songName.contains("故事") || 
                  songName.contains("民谣") || songName.contains("平凡")) {
            return "民谣";
        }
        
        return baseGenre;
    }
    
    /**
     * 初始化所有数据
     */
    public void initAllData() {
        log.info("开始初始化数据...");
        
        // 1. 初始化歌手数据
        initSingers();
        
        // 2. 初始化歌曲数据
        initSongs();
        
        log.info("数据初始化完成！");
    }
    
    /**
     * 初始化歌手数据
     */
    public void initSingers() {
        log.info("开始初始化歌手数据...");
        
        String singerPicPath = uploadPath + "img/singerPic/";
        File singerPicDir = new File(singerPicPath);
        
        if (!singerPicDir.exists()) {
            log.warn("歌手图片目录不存在: {}", singerPicPath);
            return;
        }
        
        File[] singerPicFiles = singerPicDir.listFiles((dir, name) -> 
            name.toLowerCase().endsWith(".jpg") || 
            name.toLowerCase().endsWith(".jpeg") || 
            name.toLowerCase().endsWith(".png"));
        
        if (singerPicFiles == null) {
            return;
        }
        
        int insertCount = 0;
        for (File file : singerPicFiles) {
            String fileName = file.getName();
            String singerName = fileName.substring(0, fileName.lastIndexOf('.'));
            
            // 检查歌手是否已存在
            Singer existingSinger = singerMapper.selectByName(singerName);
            if (existingSinger != null) {
                continue;
            }
            
            Singer singer = new Singer();
            singer.setName(singerName);
            singer.setAvatar(domain + "/img/singerPic/" + fileName);
            singer.setStatus(1);
            singer.setPlayCount(0L);
            singer.setFanCount(0L);
            singer.setCreateTime(LocalDateTime.now());
            singer.setUpdateTime(LocalDateTime.now());
            
            singerMapper.insert(singer);
            insertCount++;
            log.info("插入歌手: {}", singerName);
        }
        
        log.info("歌手数据初始化完成，共插入 {} 条记录", insertCount);
    }
    
    /**
     * 初始化歌曲数据
     */
    public void initSongs() {
        log.info("开始初始化歌曲数据...");
        
        String songPath = uploadPath + "song/";
        File songDir = new File(songPath);
        
        if (!songDir.exists()) {
            log.warn("歌曲目录不存在: {}", songPath);
            return;
        }
        
        File[] songFiles = songDir.listFiles((dir, name) -> 
            name.toLowerCase().endsWith(".mp3") || 
            name.toLowerCase().endsWith(".m4a") || 
            name.toLowerCase().endsWith(".wav"));
        
        if (songFiles == null) {
            return;
        }
        
        // 预加载所有歌手数据
        Map<String, Singer> singerMap = new HashMap<>();
        singerMapper.selectList(null).forEach(singer -> 
            singerMap.put(singer.getName(), singer));
        
        int insertCount = 0;
        for (File file : songFiles) {
            String fileName = file.getName();
            
            // 检查歌曲是否已存在
            Song existingSong = songMapper.selectByAudioUrl("/song/" + fileName);
            if (existingSong != null) {
                continue;
            }
            
            Song song = parseSongFromFile(file, singerMap);
            if (song != null) {
                songMapper.insert(song);
                insertCount++;
                log.info("插入歌曲: {} - {}", song.getSingerName(), song.getName());
            }
        }
        
        log.info("歌曲数据初始化完成，共插入 {} 条记录", insertCount);
    }
    
    /**
     * 从文件解析歌曲信息
     */
    private Song parseSongFromFile(File file, Map<String, Singer> singerMap) {
        String fileName = file.getName();
        String nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        String extension = fileName.substring(fileName.lastIndexOf('.') + 1);
        
        // 解析歌手和歌曲名
        String[] parts = nameWithoutExtension.split("-", 2);
        if (parts.length != 2) {
            log.warn("文件名格式不正确，跳过: {}", fileName);
            return null;
        }
        
        String singerName = parts[0].trim();
        String songName = parts[1].trim();
        
        // 获取或创建歌手
        Singer singer = singerMap.get(singerName);
        if (singer == null) {
            singer = createSinger(singerName);
            singerMap.put(singerName, singer);
        }
        
        // 创建歌曲
        Song song = new Song();
        song.setName(songName);
        song.setSingerId(singer.getId());
        song.setAudioUrl(domain + "/song/" + fileName);
        song.setFormat(extension.toLowerCase());
        song.setStatus(1);
        song.setPlayCount(0L);
        song.setDownloadCount(0L);
        song.setLikeCount(0L);
        song.setFileSize(file.length());
        song.setCreateTime(LocalDateTime.now());
        song.setUpdateTime(LocalDateTime.now());
        
        // 设置歌曲风格
        String genre = detectSongGenre(songName, singerName);
        song.setGenre(genre);
        
        // 设置一些默认值
        song.setDuration(240); // 默认4分钟
        song.setLanguage(detectLanguage(singerName));
        
        // 尝试匹配歌曲封面
        String coverUrl = findSongCover(songName, singerName);
        if (coverUrl != null) {
            song.setCoverUrl(coverUrl);
        }
        
        // 设置示例歌词
        String lyrics = generateSampleLyrics(songName, singerName);
        song.setLyric(lyrics);
        
        return song;
    }
    
    /**
     * 创建新歌手
     */
    private Singer createSinger(String singerName) {
        Singer singer = new Singer();
        singer.setName(singerName);
        singer.setStatus(1);
        singer.setPlayCount(0L);
        singer.setFanCount(0L);
        singer.setCreateTime(LocalDateTime.now());
        singer.setUpdateTime(LocalDateTime.now());
        
        // 尝试匹配歌手头像
        String avatarUrl = findSingerAvatar(singerName);
        if (avatarUrl != null) {
            singer.setAvatar(avatarUrl);
        }
        
        singerMapper.insert(singer);
        log.info("创建新歌手: {}", singerName);
        return singer;
    }
    
    /**
     * 查找歌手头像
     */
    private String findSingerAvatar(String singerName) {
        String[] extensions = {".jpg", ".jpeg", ".png"};
        String singerPicPath = uploadPath + "img/singerPic/";
        
        // 歌手名映射表（中文名 -> 文件名）
        Map<String, String> singerFileMap = new HashMap<>();
        singerFileMap.put("周杰伦", "zhoujielun");
        singerFileMap.put("林俊杰", "linjunjie");
        singerFileMap.put("陈奕迅", "chenyixun");
        singerFileMap.put("王力宏", "wanglihong");
        singerFileMap.put("李荣浩", "lironghao");
        singerFileMap.put("毛不易", "maobuyi");
        singerFileMap.put("朴树", "pushu");
        singerFileMap.put("五月天", "wuyuetian");
        singerFileMap.put("IU", "IU");
        singerFileMap.put("金泰妍", "taiyan");
        singerFileMap.put("艺声", "yisheng");
        singerFileMap.put("张国荣", "zhangguorong");
        singerFileMap.put("李克勤", "likeqin");
        singerFileMap.put("王菲", "wangfei");
        singerFileMap.put("张杰", "zhangjie");
        singerFileMap.put("邓紫棋", "dengziqi");
        singerFileMap.put("田馥甄", "tianfuzhen");
        singerFileMap.put("张碧晨", "zhangbichen");
        singerFileMap.put("许嵩", "xusong");
        singerFileMap.put("杨宗纬", "yangzongwei");
        singerFileMap.put("林允儿", "linyuner");
        singerFileMap.put("梁耀燮", "liangyaoxie");
        singerFileMap.put("程世安", "chengshian");
        singerFileMap.put("Eminem", "Eminem");
        singerFileMap.put("Ennio Morricone", "Morricone");
        
        // 首先尝试映射表
        String fileName = singerFileMap.get(singerName);
        if (fileName != null) {
            for (String ext : extensions) {
                File avatarFile = new File(singerPicPath + fileName + ext);
                if (avatarFile.exists()) {
                    return domain + "/img/singerPic/" + fileName + ext;
                }
            }
        }
        
        // 然后尝试直接用歌手名
        for (String ext : extensions) {
            File avatarFile = new File(singerPicPath + singerName + ext);
            if (avatarFile.exists()) {
                return domain + "/img/singerPic/" + singerName + ext;
            }
        }
        return null;
    }
    
    /**
     * 查找歌曲封面
     */
    private String findSongCover(String songName, String singerName) {
        String[] extensions = {".jpg", ".jpeg", ".png"};
        String songPicPath = uploadPath + "img/songPic/";
        
        // 歌曲名映射表（歌曲名 -> 文件名）
        Map<String, String> songFileMap = new HashMap<>();
        songFileMap.put("晴天", "qingtian");
        songFileMap.put("七里香", "qilixiang");
        songFileMap.put("稻香", "daoxiang");
        songFileMap.put("菊花台", "juhuatai");
        songFileMap.put("红玫瑰", "hongmeigui");
        songFileMap.put("不要说话", "buyaoshuohua");
        songFileMap.put("简信", "jianxin");
        songFileMap.put("海阔天空", "haikuotiankong");
        songFileMap.put("龙卷风", "longjuanfeng");
        songFileMap.put("听妈妈的话", "tingmamadehua");
        songFileMap.put("夜的第七章", "yedediqizhang");
        songFileMap.put("开不了口", "kaibulkou");
        songFileMap.put("烟花易冷", "yanhuayileng");
        songFileMap.put("夜空中最亮的星", "yekongzhongzuiliangdexing");
        songFileMap.put("因为爱情", "yinweiaiqing");
        songFileMap.put("如果爱", "ruguoai1");
        songFileMap.put("泡沫", "paomo");
        songFileMap.put("踏步东", "tabudong1");
        songFileMap.put("需要人陪", "xuyaorenpei");
        songFileMap.put("告白气球", "gaobaiqiqui");
        songFileMap.put("关键词", "guanjianci");
        songFileMap.put("红尘客栈", "hongchengkezhan");
        songFileMap.put("大城小爱", "dachengxiaoai");
        songFileMap.put("黑暗骑士", "heianqishi");
        songFileMap.put("魔鬼中的天使", "moguizhongdetianshi");
        songFileMap.put("何必要在一起", "hebiyaozaiyiqi");
        songFileMap.put("你站", "nizhan");
        songFileMap.put("你在很忙", "nuizaihenmang");
        songFileMap.put("Love The Way You Lie", "LoveTheWayYouLie");
        songFileMap.put("Here I am", "HereIam");
        songFileMap.put("Bye Bye Love", "ByeByeLove");
        songFileMap.put("Blossom", "Blossom");
        songFileMap.put("Shadow", "Shadow");
        songFileMap.put("Ribbon", "Ribbon");
        songFileMap.put("Umbrella", "Umbrella");
        songFileMap.put("Confession", "Confession");
        
        // 首先尝试映射表
        String fileName = songFileMap.get(songName);
        if (fileName != null) {
            for (String ext : extensions) {
                File coverFile = new File(songPicPath + fileName + ext);
                if (coverFile.exists()) {
                    return domain + "/img/songPic/" + fileName + ext;
                }
            }
        }
        
        // 尝试不同的文件名格式
        String[] possibleNames = {
            songName,
            singerName + "-" + songName,
            songName.toLowerCase(),
            songName.replace(" ", ""),
            songName.replaceAll("[\\s\\u4e00-\\u9fff]", ""), // 去掉空格和中文字符
        };
        
        for (String name : possibleNames) {
            for (String ext : extensions) {
                File coverFile = new File(songPicPath + name + ext);
                if (coverFile.exists()) {
                    return domain + "/img/songPic/" + name + ext;
                }
            }
        }
        
        return null;
    }
    
    /**
     * 检测歌曲语言
     */
    private String detectLanguage(String singerName) {
        if (singerGenreMap.getOrDefault(singerName, "").contains("韩")) {
            return "韩语";
        } else if (singerGenreMap.getOrDefault(singerName, "").contains("欧美") || 
                  Arrays.asList("Eminem", "Celine Dion", "Álvaro Soler", 
                               "The Piano Guys", "Ennio Morricone").contains(singerName)) {
            return "英语";
        } else {
            return "中文";
        }
    }
    
    /**
     * 生成示例歌词（占位符内容，实际使用时需替换为正版授权歌词）
     */
    private String generateSampleLyrics(String songName, String singerName) {
        // 注意：这里使用的是示例歌词，实际部署时需要获取正版授权的歌词内容
        
        // 根据歌曲类型生成不同风格的示例歌词
        String language = detectLanguage(singerName);
        String genre = detectSongGenre(songName, singerName);
        
        if ("英语".equals(language)) {
            return generateEnglishSampleLyrics(songName, singerName, genre);
        } else if ("韩语".equals(language)) {
            return generateKoreanSampleLyrics(songName, singerName, genre);
        } else {
            return generateChineseSampleLyrics(songName, singerName, genre);
        }
    }
    
    /**
     * 生成中文示例歌词
     */
    private String generateChineseSampleLyrics(String songName, String singerName, String genre) {
        return String.format("[00:00.00] %s\n" +
                "[00:05.00] 演唱：%s\n" +
                "[00:10.00] \n" +
                "[00:15.00] 这是一首关于%s的歌\n" +
                "[00:20.00] 在音乐的世界里翱翔\n" +
                "[00:25.00] 每一个音符都在诉说\n" +
                "[00:30.00] 那些美好的时光\n" +
                "[00:35.00] \n" +
                "[00:40.00] 副歌：\n" +
                "[00:45.00] 让音乐带走所有忧伤\n" +
                "[00:50.00] 在旋律中找到希望\n" +
                "[00:55.00] 这就是%s的力量\n" +
                "[01:00.00] 永远在心中回响\n" +
                "[01:05.00] \n" +
                "[01:10.00] （注：此为示例歌词，实际使用需获得版权方授权）",
                songName, singerName, songName.length() > 0 ? songName.substring(0, Math.min(2, songName.length())) : "音乐", genre);
    }
    
    /**
     * 生成英文示例歌词
     */
    private String generateEnglishSampleLyrics(String songName, String singerName, String genre) {
        return String.format("[00:00.00] %s\n" +
                "[00:05.00] Artist: Sample Artist\n" +
                "[00:10.00] \n" +
                "[00:15.00] This is a song about music and dreams\n" +
                "[00:20.00] Dancing through the melodies\n" +
                "[00:25.00] Every note tells a story\n" +
                "[00:30.00] Of hopes and memories\n" +
                "[00:35.00] \n" +
                "[00:40.00] Chorus:\n" +
                "[00:45.00] Let the music take you high\n" +
                "[00:50.00] To the stars up in the sky\n" +
                "[00:55.00] This is where our hearts can fly\n" +
                "[01:00.00] Music never says goodbye\n" +
                "[01:05.00] \n" +
                "[01:10.00] (Note: Sample lyrics for demo purposes only)",
                songName);
    }
    
    /**
     * 生成韩文示例歌词
     */
    private String generateKoreanSampleLyrics(String songName, String singerName, String genre) {
        return String.format("[00:00.00] %s\n" +
                "[00:05.00] 가수: 샘플 아티스트\n" +
                "[00:10.00] \n" +
                "[00:15.00] 음악 속에서 꿈을 찾아요\n" +
                "[00:20.00] 멜로디와 함께 춤을 춰요\n" +
                "[00:25.00] 모든 음표가 말해줘요\n" +
                "[00:30.00] 아름다운 이야기를\n" +
                "[00:35.00] \n" +
                "[00:40.00] 후렴:\n" +
                "[00:45.00] 음악이 우리를 높이 데려가요\n" +
                "[00:50.00] 하늘의 별들까지\n" +
                "[00:55.00] 우리 마음이 날 수 있는 곳\n" +
                "[01:00.00] 음악은 영원해요\n" +
                "[01:05.00] \n" +
                "[01:10.00] (참고: 데모용 샘플 가사입니다)",
                songName);
    }
}
