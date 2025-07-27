package com.example.jav_projecto1.respiratory;

import com.example.jav_projecto1.entities.ShowDates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShowDatesRepository extends JpaRepository<ShowDates, Integer> {
}