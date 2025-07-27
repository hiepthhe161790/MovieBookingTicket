package com.example.jav_projecto1.controller;

import com.example.jav_projecto1.entities.Movie;
import com.example.jav_projecto1.respiratory.MovieRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.util.*;

import com.example.jav_projecto1.dto.MovieDTO;
import com.example.jav_projecto1.entities.CinemaRoom;
import com.example.jav_projecto1.respiratory.CinemaRoomRepository;
import com.example.jav_projecto1.entities.Type;
import com.example.jav_projecto1.respiratory.TypeRepository;
import com.example.jav_projecto1.entities.MovieType;
import com.example.jav_projecto1.respiratory.MovieTypeRepository;
import com.example.jav_projecto1.dto.MovieUpdateRequest;
import org.springframework.transaction.annotation.Transactional;
import com.example.jav_projecto1.entities.MovieTypeId;
import com.example.jav_projecto1.service.MovieService;
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<MovieDTO> getAllMovies() {
        return movieService.getAllMovies();
    }

    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        return movieService.addMovie(movie);
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<MovieDTO> updateMovie(@PathVariable String id, @RequestBody MovieUpdateRequest movieDetails) {
        return movieService.updateMovie(id, movieDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable String id) {
        return movieService.deleteMovie(id);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchMoviesByType(@RequestParam(required = false) String type) {
        return movieService.searchMoviesByType(type);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> getMovieDetail(@PathVariable String id) {
        return movieService.getMovieDetail(id);
    }
    @GetMapping("/showtimes-by-date")
public ResponseEntity<?> getShowtimesByDate(@RequestParam String date) {
    return movieService.getShowtimesByDate(date);
}
@GetMapping("/now-showing")
public ResponseEntity<?> getNowShowingMovies() {
    return movieService.getNowShowingMovies();
}

@GetMapping("/coming-soon")
public ResponseEntity<?> getComingSoonMovies() {
    return movieService.getComingSoonMovies();
}
}
