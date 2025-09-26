package com.music;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * 音乐网站启动类
 */
@SpringBootApplication
@MapperScan("com.music.mapper")
@ComponentScan(basePackages = "com.music")
public class MusicWebBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MusicWebBackendApplication.class, args);
        System.out.println("=================================");
        System.out.println("🎵 音乐网站后端服务启动成功！");
        System.out.println("📖 API文档地址: http://localhost:8080/api/doc.html");
        System.out.println("=================================");
    }
}
