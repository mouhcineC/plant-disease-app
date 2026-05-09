package com.plantdisease.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.plantdisease.dto.HistoryResponse;
import com.plantdisease.dto.PredictionResponse;
import com.plantdisease.entity.Prediction;
import com.plantdisease.entity.Scan;
import com.plantdisease.entity.User;
import com.plantdisease.exception.CustomException;
import com.plantdisease.repository.PredictionRepository;
import com.plantdisease.repository.ScanRepository;
import com.plantdisease.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class ScanService {
    private final CloudinaryService cloudinaryService;
    private final AIClient aiClient;
    private final ScanRepository scanRepository;
    private final PredictionRepository predictionRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public PredictionResponse processScan(MultipartFile file, String userEmail) {
        //1find user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomException("User not found"));
        //2upload image to cloudinary
        String imageUrl = cloudinaryService.uploadImage(file);
        //3Save scan
        Scan scan = Scan.builder()
                .imageUrl(imageUrl)
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        scanRepository.save(scan);

        //4Send image to AI Service
        PredictionResponse aiResult = aiClient.predict(file);
        if (aiResult == null) {
            throw new CustomException("AI service returned an empty response");
        }
        if ("error".equalsIgnoreCase(aiResult.getStatus())) {
            String message = aiResult.getMessage() != null ? aiResult.getMessage() : "AI service could not process the image";
            throw new CustomException(message);
        }
        //5Save prediction result
        Prediction  prediction = Prediction.builder()
                .scan(scan)
                .plant(aiResult.getPlant())
                .disease(aiResult.getDisease())
                .confidence(aiResult.getConfidence())
                .severity(aiResult.getSeverity())
                .explanation(aiResult.getExplanation())
                .solutions(toJson(aiResult.getSolutions()))
                .topPredictions(toJson(aiResult.getTopPredictions()))
                .build();
        predictionRepository.save(prediction);
        //6return response
        return aiResult;
    }


    public List<HistoryResponse> getUserHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomException("User not found"));
        List<Scan> scans = scanRepository.findByUserOrderByCreatedAtDesc(user);
        return scans.stream()
                .map(scan -> {
                    Prediction prediction = predictionRepository
                              .findByScan(scan)
                               .orElse(null);
                    return HistoryResponse.builder()
                            .id(scan.getId())
                            .imageUrl(scan.getImageUrl())
                            .createdAt(scan.getCreatedAt())
                            .plant(prediction != null ? prediction.getPlant() : null)
                            .disease(prediction != null ? prediction.getDisease() : null)
                            .confidence(prediction != null ? prediction.getConfidence() : null)
                            .severity(prediction != null ? prediction.getSeverity() : null)
                            .explanation(prediction != null ? prediction.getExplanation() : null)
                            .solutions(prediction != null ? parseSolutions(prediction.getSolutions()) : null)
                            .topPredictions(prediction != null ? parseTopPredictions(prediction.getTopPredictions()) : null)
                            .build();

            })
                .toList();
    }

    private String toJson(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            throw new CustomException("Failed to serialize AI response");
        }
    }

    private HistoryResponse.Solution parseSolutions(String payload) {
        if (payload == null || payload.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(payload, HistoryResponse.Solution.class);
        } catch (Exception exception) {
            return null;
        }
    }

    private List<HistoryResponse.TopPrediction> parseTopPredictions(String payload) {
        if (payload == null || payload.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(payload, new TypeReference<List<HistoryResponse.TopPrediction>>() {});
        } catch (Exception exception) {
            return null;
        }
    }

    @Transactional
    public void deleteScan(Long scanId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomException("User not found"));
        Scan scan = scanRepository.findByIdAndUser(scanId, user)
                .orElseThrow(() -> new CustomException("Scan not found"));
        predictionRepository.deleteByScanId(scan.getId());
        scanRepository.delete(scan);
    }
}
