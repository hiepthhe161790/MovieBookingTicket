package com.example.jav_projecto1.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "reward_point")
public class RewardPoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reward_id")
    private Long rewardId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "points")
    private Integer points;

    @Column(name = "reward_date")
    private LocalDate rewardDate;

    @Column(name = "type")
private String type;
} 