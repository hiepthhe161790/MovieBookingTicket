package com.example.jav_projecto1.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieScheduleId implements java.io.Serializable {
    private String movieId;
    private Integer scheduleId;

     @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MovieScheduleId)) return false;
        MovieScheduleId that = (MovieScheduleId) o;
        return movieId.equals(that.movieId) && scheduleId.equals(that.scheduleId);
    }
    @Override
    public int hashCode() {
        return 31 * movieId.hashCode() + scheduleId.hashCode();
    }
}