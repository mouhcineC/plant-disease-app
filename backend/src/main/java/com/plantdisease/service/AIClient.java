package com.plantdisease.service;

import com.plantdisease.dto.PredictionResponse;
import com.plantdisease.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AIClient {

    @Value("${app.ai-service.url}")
    private String aiServiceUrl;

    public PredictionResponse predict(MultipartFile file) {

        RestTemplate restTemplate = new RestTemplate();

        ByteArrayResource resource;
        try {
            resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
        } catch (Exception e) {
            throw new CustomException("Failed to process image file");
        }

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", resource);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

        String baseUrl = aiServiceUrl != null ? aiServiceUrl.replaceAll("/+$", "") : "";
        String endpoint = baseUrl.endsWith("/api") ? baseUrl + "/predict" : baseUrl + "/api/predict";

        ResponseEntity<PredictionResponse> response =
                restTemplate.exchange(
                        endpoint,
                        HttpMethod.POST,
                        requestEntity,
                        PredictionResponse.class
                );

        return response.getBody();
    }


}