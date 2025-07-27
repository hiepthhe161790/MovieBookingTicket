package com.example.jav_projecto1.dto;

import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDateDTO {
    private String movieId;
    private Integer showDateId;
    private String movieName;
    private String dateName;
    private String showDate; // ISO String hoặc yyyy-MM-dd
}