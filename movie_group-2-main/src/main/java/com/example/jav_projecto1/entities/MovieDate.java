package com.example.jav_projecto1.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieDate {
    @EmbeddedId
    private MovieDateId id;

    @ManyToOne
    @MapsId("movieId")
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne
    @MapsId("showDateId")
    @JoinColumn(name = "show_date_id")
    private ShowDates showDates;
}

