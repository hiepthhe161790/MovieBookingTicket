package com.example.jav_projecto1.respiratory;

import com.example.jav_projecto1.entities.MovieType;
import com.example.jav_projecto1.entities.MovieTypeId;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieTypeRepository extends JpaRepository<MovieType, MovieTypeId> {
    void deleteAllByMovie_MovieId(String movieId);
}