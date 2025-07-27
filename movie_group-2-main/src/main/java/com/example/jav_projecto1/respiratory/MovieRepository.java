package com.example.jav_projecto1.respiratory;

import com.example.jav_projecto1.entities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, String> {
}