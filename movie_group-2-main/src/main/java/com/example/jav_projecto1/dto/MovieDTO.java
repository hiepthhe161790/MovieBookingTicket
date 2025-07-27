package com.example.jav_projecto1.dto;

import java.util.Date;
import lombok.*;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDTO {
    private String movieId;
    private String movieNameEnglish;
    private String movieNameVn;
    private String director;
    private String actor;
    private Integer duration;
    private Date fromDate;
    private Date toDate;
    private String content;
    private String largeImage;
    private String smallImage;
    private List<String> types;
     private Integer cinemaRoomId;
    private String cinemaRoomName;
    private String version;
    private String movieProductionCompany;
}