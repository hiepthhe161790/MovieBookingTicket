package com.example.jav_projecto1.respiratory;

import com.example.jav_projecto1.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMovie_MovieId(String movieId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.movie.movieId = :movieId")
    Double findAverageRatingByMovieId(String movieId);
}