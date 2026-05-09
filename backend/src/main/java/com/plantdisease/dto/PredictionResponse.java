package com.plantdisease.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PredictionResponse {
    private String status;
    private String plant;
    private String disease;
    private Float confidence;
    private String severity;
    private String explanation;
    private Solution solutions;
    @JsonProperty("top_predictions")
    private List<TopPrediction> topPredictions;
    private String code;
    private String message;

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
