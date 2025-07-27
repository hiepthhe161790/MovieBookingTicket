package com.example.jav_projecto1.respiratory;

import com.example.jav_projecto1.entities.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
   List<Seat> findByCinemaRoom_CinemaRoomId(Integer cinemaRoomId);
}