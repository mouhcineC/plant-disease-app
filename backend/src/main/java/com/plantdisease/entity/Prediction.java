package com.plantdisease.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "predections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String plant ;
    private String disease;
    private Float confidence;
    private String severity;
    @Column(columnDefinition = "TEXT")
    private String explanation;
    @Column(columnDefinition = "TEXT")
    private String solutions;
    @Column(columnDefinition = "TEXT")
    private String topPredictions;
    @OneToOne
    @JoinColumn(name = "scan_id" , nullable = false)
    private Scan scan;
}
