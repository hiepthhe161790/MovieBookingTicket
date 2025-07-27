package com.example.jav_projecto1.dto;

import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleDTO {
    private Integer scheduleId;
    private String scheduleTime;
}