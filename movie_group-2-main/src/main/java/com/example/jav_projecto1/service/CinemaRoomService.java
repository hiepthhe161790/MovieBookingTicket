package com.example.jav_projecto1.service;

import com.example.jav_projecto1.entities.CinemaRoom;
import com.example.jav_projecto1.respiratory.CinemaRoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CinemaRoomService {
    private final CinemaRoomRepository cinemaRoomRepository;

    public CinemaRoomService(CinemaRoomRepository cinemaRoomRepository) {
        this.cinemaRoomRepository = cinemaRoomRepository;
    }

    public List<CinemaRoom> getAllCinemaRooms() {
        return cinemaRoomRepository.findAll();
    }

    public Optional<CinemaRoom> getCinemaRoomById(Integer id) {
        return cinemaRoomRepository.findById(id);
    }

    public CinemaRoom createCinemaRoom(CinemaRoom cinemaRoom) {
        return cinemaRoomRepository.save(cinemaRoom);
    }

    public Optional<CinemaRoom> updateCinemaRoom(Integer id, CinemaRoom roomDetails) {
        Optional<CinemaRoom> roomOpt = cinemaRoomRepository.findById(id);
        if (roomOpt.isEmpty()) {
            return Optional.empty();
        }
        CinemaRoom room = roomOpt.get();
        room.setRoomName(roomDetails.getRoomName());
        room.setCapacity(roomDetails.getCapacity());
        room.setDescription(roomDetails.getDescription());
        return Optional.of(cinemaRoomRepository.save(room));
    }

    public boolean deleteCinemaRoom(Integer id) {
        if (!cinemaRoomRepository.existsById(id)) {
            return false;
        }
        cinemaRoomRepository.deleteById(id);
        return true;
    }
}