package com.example.jav_projecto1.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieDateId implements java.io.Serializable {
    private String movieId;
    private Integer showDateId;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MovieDateId)) return false;
        MovieDateId that = (MovieDateId) o;
        return movieId.equals(that.movieId) && showDateId.equals(that.showDateId);
    }
    @Override
    public int hashCode() {
        return 31 * movieId.hashCode() + showDateId.hashCode();
    }
}