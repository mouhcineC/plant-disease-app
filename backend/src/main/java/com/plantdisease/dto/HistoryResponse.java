package com.plantdisease.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryResponse {
    private Long id;
    private String imageUrl;
    private String plant ;
    private String disease ;
    private Float confidence ;
    private String severity;
    private String explanation;
    private Solution solutions;
    private List<TopPrediction> topPredictions;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    public static class Solution {
        private String chemical;
        private String organic;
        private String prevention;
    }

    @Getter
    @Setter
    public static class TopPrediction {
        private String disease;
        private Float confidence;
    }
}
