package com.example.jav_projecto1.dto;

import lombok.*;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieUpdateRequest {
    private String actor;
    private Integer cinemaRoomId;
    private String content;
    private String director;
    private Integer duration;
    private Date fromDate;
    private String movieProductionCompany;
    private Date toDate;
    private String version;
    private String movieNameEnglish;
    private String movieNameVn;
    private String largeImage;
    private String smallImage;
    private List<Integer> types; // typeId list
}