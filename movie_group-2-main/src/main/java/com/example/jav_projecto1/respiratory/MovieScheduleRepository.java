package com.example.jav_projecto1.respiratory;

import com.example.jav_projecto1.entities.MovieSchedule;
import com.example.jav_projecto1.entities.MovieScheduleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieScheduleRepository extends JpaRepository<MovieSchedule, MovieScheduleId> {
}