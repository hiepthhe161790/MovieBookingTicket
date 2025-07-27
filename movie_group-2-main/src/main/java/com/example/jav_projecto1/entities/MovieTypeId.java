
// @Embeddable
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// public class MovieTypeId implements java.io.Serializable {
//     private String movieId;
//     private Integer typeId;
// }
package com.example.jav_projecto1.entities;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieTypeId implements java.io.Serializable {
    private String movieId;
    private Integer typeId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MovieTypeId)) return false;
        MovieTypeId that = (MovieTypeId) o;
        return movieId.equals(that.movieId) && typeId.equals(that.typeId);
    }

    @Override
    public int hashCode() {
        return 31 * movieId.hashCode() + typeId.hashCode();
    }
}