package com.example.jav_projecto1.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {
    @Id
    @Column(length = 10)
    private String movieId;

    private String actor;

    @ManyToOne
    @JoinColumn(name = "cinema_room_id")
    private CinemaRoom cinemaRoom;

    @Column(length = 1000)
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

    // Relationships
    @OneToMany(mappedBy = "movie")
    private List<MovieSchedule> movieSchedules;

    @OneToMany(mappedBy = "movie")
    private List<MovieType> movieTypes;

    @OneToMany(mappedBy = "movie")
private List<MovieDate> movieDates;
}