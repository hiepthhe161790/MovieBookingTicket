package com.example.jav_projecto1.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardPointHistoryDTO {
    private Long rewardId;
    private Integer points;
    private LocalDate rewardDate;
    private String type;
}