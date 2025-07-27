package com.example.jav_projecto1.dto;

import lombok.*;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long reviewId;
    private String movieId;
    private Long accountId;
    private String accountName;
    private Integer rating;
    private String comment;
    private Timestamp createdAt;
}