package com.plantdisease.repository;

import com.plantdisease.entity.Prediction;
import com.plantdisease.entity.Scan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PredictionRepository extends JpaRepository<Prediction,Long> {
   Optional<Prediction>  findByScan(Scan scan);
   void deleteByScan(Scan scan);
   void deleteByScanId(Long scanId);
}
