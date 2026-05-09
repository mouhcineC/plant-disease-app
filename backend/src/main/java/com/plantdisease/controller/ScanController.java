package com.plantdisease.controller;

import com.plantdisease.dto.HistoryResponse;
import com.plantdisease.dto.PredictionResponse;
import com.plantdisease.service.ScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/scan")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ScanController {
    private final ScanService scanService;

    @PostMapping
    public ResponseEntity<PredictionResponse> uploadscan(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        String userEmail = authentication.getName();
        PredictionResponse result = scanService.processScan(file, userEmail);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/history")
    public ResponseEntity<List<HistoryResponse>> gethistory(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(scanService.getUserHistory(userEmail));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScan(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        scanService.deleteScan(id, userEmail);
        return ResponseEntity.noContent().build();
    }

}
