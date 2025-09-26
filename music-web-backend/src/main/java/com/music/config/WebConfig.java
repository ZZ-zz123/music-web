package com.music.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${file.upload.path}")
    private String uploadPath;
    
    /**
     * 配置静态资源访问
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置文件访问路径 - 添加CORS支持
        registry.addResourceHandler("/img/**")
                .addResourceLocations("file:" + uploadPath + "img/")
                .setCachePeriod(3600)
                .resourceChain(true);
        
        registry.addResourceHandler("/song/**")
                .addResourceLocations("file:" + uploadPath + "song/")
                .setCachePeriod(3600)
                .resourceChain(true);
        
        registry.addResourceHandler("/avatorImages/**")
                .addResourceLocations("file:" + uploadPath + "avatorImages/")
                .setCachePeriod(3600)
                .resourceChain(true);
        
        // Knife4j文档
        registry.addResourceHandler("doc.html")
                .addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
    
    /**
     * 配置跨域
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)  // 允许携带Cookie/Session
                .maxAge(3600);
    }
}
