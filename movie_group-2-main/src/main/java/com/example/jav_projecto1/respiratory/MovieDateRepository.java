package com.example.jav_projecto1.respiratory;

import com.example.jav_projecto1.entities.MovieDate;
import com.example.jav_projecto1.entities.MovieDateId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieDateRepository extends JpaRepository<MovieDate, MovieDateId> {
}