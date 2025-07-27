package com.example.jav_projecto1.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private String movieId;
    private Long accountId;
    private Integer rating;
    private String comment;
}