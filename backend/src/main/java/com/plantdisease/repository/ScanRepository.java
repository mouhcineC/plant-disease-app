package com.plantdisease.repository;

import com.plantdisease.entity.Scan;
import com.plantdisease.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScanRepository extends JpaRepository<Scan, Long> {
    List<Scan> findByUserOrderByCreatedAtDesc(User user);
    Optional<Scan> findByIdAndUser(Long id, User user);
}
