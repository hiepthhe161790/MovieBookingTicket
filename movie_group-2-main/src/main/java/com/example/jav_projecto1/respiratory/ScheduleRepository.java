package com.example.jav_projecto1.respiratory;

import com.example.jav_projecto1.entities.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
}