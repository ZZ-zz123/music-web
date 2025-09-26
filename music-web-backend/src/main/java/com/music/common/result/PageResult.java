package com.music.common.result;

import lombok.Data;
import java.util.List;
import java.util.ArrayList;

/**
 * 分页结果
 */
@Data
public class PageResult<T> {
    
    private List<T> records;
    private Long total;
    private Long current;
    private Long size;
    private Long pages;
    
    public PageResult() {}
    
    public PageResult(List<T> records, Long total, Long current, Long size) {
        this.records = records;
        this.total = total;
        this.current = current;
        this.size = size;
        this.pages = (total + size - 1) / size; // 计算总页数
    }
    
    /**
     * 空分页结果
     */
    public static <T> PageResult<T> empty(Long current, Long size) {
        return new PageResult<>(new ArrayList<>(), 0L, current, size);
    }
}
