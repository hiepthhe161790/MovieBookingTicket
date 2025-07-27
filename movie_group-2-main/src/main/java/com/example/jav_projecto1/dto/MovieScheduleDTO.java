package com.example.jav_projecto1.dto;

import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieScheduleDTO {
    private String movieId;
    private Integer scheduleId;
    private String movieName;
    private String scheduleTime;
}