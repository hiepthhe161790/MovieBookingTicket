package com.example.jav_projecto1.dto;

import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeDTO {
    private Integer scheduleId;
    private String scheduleTime;
    private Integer showDateId;
    private Date showDate;
    private String dateName;
}