package com.example.jav_projecto1.service;

import com.example.jav_projecto1.entities.*;
import com.example.jav_projecto1.respiratory.*;
import com.example.jav_projecto1.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.util.*;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final CinemaRoomRepository cinemaRoomRepository;
    private final TypeRepository typeRepository;
    private final MovieTypeRepository movieTypeRepository;

    public MovieService(MovieRepository movieRepository, CinemaRoomRepository cinemaRoomRepository, TypeRepository typeRepository, MovieTypeRepository movieTypeRepository) {
        this.movieRepository = movieRepository;
        this.cinemaRoomRepository = cinemaRoomRepository;
        this.typeRepository = typeRepository;
        this.movieTypeRepository = movieTypeRepository;
    }

    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll().stream().map(movie ->
                MovieDTO.builder()
                        .movieId(movie.getMovieId())
                        .movieNameEnglish(movie.getMovieNameEnglish())
                        .movieNameVn(movie.getMovieNameVn())
                        .director(movie.getDirector())
                        .actor(movie.getActor())
                        .duration(movie.getDuration())
                        .fromDate(movie.getFromDate())
                        .toDate(movie.getToDate())
                        .content(movie.getContent())
                        .largeImage(movie.getLargeImage())
                        .smallImage(movie.getSmallImage())
                        .types(
                                movie.getMovieTypes() == null ? List.of() :
                                        movie.getMovieTypes().stream()
                                                .map(mt -> mt.getType().getTypeName())
                                                .toList()
                        )
                        .cinemaRoomId(
                                movie.getCinemaRoom() != null ? movie.getCinemaRoom().getCinemaRoomId() : null
                        )
                        .cinemaRoomName(
                                movie.getCinemaRoom() != null ? movie.getCinemaRoom().getRoomName() : null
                        )
                        .version(movie.getVersion())
                        .movieProductionCompany(movie.getMovieProductionCompany())
                        .build()
        ).toList();
    }

    public Movie addMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    @Transactional
    public ResponseEntity<MovieDTO> updateMovie(String id, MovieUpdateRequest movieDetails) {
        Optional<Movie> movieOpt = movieRepository.findById(id);
        if (movieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Movie movie = movieOpt.get();
        movie.setActor(movieDetails.getActor());

        if (movieDetails.getCinemaRoomId() != null) {
            Optional<CinemaRoom> cinemaRoomOpt = cinemaRoomRepository.findById(movieDetails.getCinemaRoomId());
            cinemaRoomOpt.ifPresent(movie::setCinemaRoom);
        }

        movie.setContent(movieDetails.getContent());
        movie.setDirector(movieDetails.getDirector());
        movie.setDuration(movieDetails.getDuration());
        movie.setFromDate(movieDetails.getFromDate());
        movie.setMovieProductionCompany(movieDetails.getMovieProductionCompany());
        movie.setToDate(movieDetails.getToDate());
        movie.setVersion(movieDetails.getVersion());
        movie.setMovieNameEnglish(movieDetails.getMovieNameEnglish());
        movie.setMovieNameVn(movieDetails.getMovieNameVn());
        movie.setLargeImage(movieDetails.getLargeImage());
        movie.setSmallImage(movieDetails.getSmallImage());

        movieTypeRepository.deleteAllByMovie_MovieId(movie.getMovieId());
        if (movieDetails.getTypes() != null) {
            for (Integer typeId : movieDetails.getTypes()) {
                Optional<Type> typeOpt = typeRepository.findById(typeId);
                if (typeOpt.isPresent()) {
                    MovieType mt = new MovieType();
                    mt.setId(new MovieTypeId(movie.getMovieId(), typeId));
                    mt.setMovie(movie);
                    mt.setType(typeOpt.get());
                    movieTypeRepository.save(mt);
                }
            }
        }
        Movie saved = movieRepository.save(movie);

        MovieDTO dto = MovieDTO.builder()
                .movieId(saved.getMovieId())
                .movieNameEnglish(saved.getMovieNameEnglish())
                .movieNameVn(saved.getMovieNameVn())
                .director(saved.getDirector())
                .actor(saved.getActor())
                .duration(saved.getDuration())
                .fromDate(saved.getFromDate())
                .toDate(saved.getToDate())
                .content(saved.getContent())
                .largeImage(saved.getLargeImage())
                .smallImage(saved.getSmallImage())
                .types(
                        movie.getMovieTypes() == null ? List.of() :
                                movie.getMovieTypes().stream()
                                        .map(mt -> mt.getType().getTypeName())
                                        .toList()
                )
                .cinemaRoomId(
                        saved.getCinemaRoom() != null ? saved.getCinemaRoom().getCinemaRoomId() : null
                )
                .cinemaRoomName(
                        saved.getCinemaRoom() != null ? saved.getCinemaRoom().getRoomName() : null
                )
                .version(saved.getVersion())
                .movieProductionCompany(saved.getMovieProductionCompany())
                .build();

        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<Void> deleteMovie(String id) {
        if (!movieRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        movieRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> searchMoviesByType(String type) {
        List<Movie> movies = movieRepository.findAll();

        List<Movie> filtered;
        if (type == null || type.isBlank()) {
            filtered = movies;
        } else {
            filtered = movies.stream()
                    .filter(m -> m.getMovieTypes() != null && m.getMovieTypes().stream()
                            .anyMatch(mt -> mt.getType().getTypeName().equalsIgnoreCase(type)))
                    .toList();
        }

        List<Map<String, Object>> searchResults = filtered.stream().map(m -> {
            List<String> types = m.getMovieTypes() == null ? List.of() :
                    m.getMovieTypes().stream()
                            .map(mt -> mt.getType().getTypeName())
                            .toList();
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("Title", m.getMovieNameEnglish());
            map.put("Year", m.getFromDate() != null ? String.valueOf(
                    m.getFromDate().toInstant().atZone(ZoneId.systemDefault()).getYear()
            ) : "");
            map.put("imdbID", m.getMovieId());
            map.put("Type", types);
            map.put("Poster", m.getLargeImage());
            return map;
        }).toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("Search", searchResults);
        response.put("totalResults", String.valueOf(searchResults.size()));
        response.put("Response", "True");

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<MovieDTO> getMovieDetail(String id) {
        Optional<Movie> movieOpt = movieRepository.findById(id);
        if (movieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Movie movie = movieOpt.get();
        MovieDTO dto = MovieDTO.builder()
                .movieId(movie.getMovieId())
                .movieNameEnglish(movie.getMovieNameEnglish())
                .movieNameVn(movie.getMovieNameVn())
                .director(movie.getDirector())
                .actor(movie.getActor())
                .duration(movie.getDuration())
                .fromDate(movie.getFromDate())
                .toDate(movie.getToDate())
                .content(movie.getContent())
                .largeImage(movie.getLargeImage())
                .smallImage(movie.getSmallImage())
                .types(
                        movie.getMovieTypes() == null ? List.of() :
                                movie.getMovieTypes().stream()
                                        .map(mt -> mt.getType().getTypeName())
                                        .toList()
                )
                .cinemaRoomId(
                        movie.getCinemaRoom() != null ? movie.getCinemaRoom().getCinemaRoomId() : null
                )
                .cinemaRoomName(
                        movie.getCinemaRoom() != null ? movie.getCinemaRoom().getRoomName() : null
                )
                .version(movie.getVersion())
                .movieProductionCompany(movie.getMovieProductionCompany())
                .build();
        return ResponseEntity.ok(dto);
    }
   public ResponseEntity<?> getShowtimesByDate(String date) {
    List<Movie> movies = movieRepository.findAll();
    List<Map<String, Object>> searchResults = new ArrayList<>();

    for (Movie movie : movies) {
        if (movie.getMovieDates() != null) {
            movie.getMovieDates().stream()
                .filter(md -> {
                    if (md.getShowDates() == null || md.getShowDates().getShowDate() == null) return false;
                    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
                    String showDateStr = sdf.format(md.getShowDates().getShowDate());
                    return showDateStr.equals(date);
                })
                .forEach(md -> {
                    List<String> types = movie.getMovieTypes() == null ? List.of() :
                        movie.getMovieTypes().stream()
                            .map(mt -> mt.getType().getTypeName())
                            .toList();
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("Title", movie.getMovieNameEnglish());
                    map.put("Year", movie.getFromDate() != null ? String.valueOf(
                        movie.getFromDate().toInstant().atZone(ZoneId.systemDefault()).getYear()
                    ) : "");
                    map.put("imdbID", movie.getMovieId());
                    map.put("Type", types);
                    map.put("Poster", movie.getLargeImage());
                    map.put("showDate", date);
                    List<String> showtimes = movie.getMovieSchedules() == null ? List.of() :
                        movie.getMovieSchedules().stream()
                            .map(ms -> ms.getSchedule().getScheduleTime())
                            .toList();
                    map.put("showtimes", showtimes);
                    searchResults.add(map);
                });
        }
    }

    Map<String, Object> response = new LinkedHashMap<>();
    response.put("Search", searchResults);
    response.put("totalResults", String.valueOf(searchResults.size()));
    response.put("Response", "True");

    return ResponseEntity.ok(response);
}
public ResponseEntity<?> getNowShowingMovies() {
    Date now = new Date();
    List<Movie> movies = movieRepository.findAll().stream()
            .filter(m -> m.getFromDate() != null && m.getToDate() != null
                    && !now.before(m.getFromDate()) && !now.after(m.getToDate()))
            .toList();

    List<Map<String, Object>> searchResults = movies.stream().map(m -> {
        List<String> types = m.getMovieTypes() == null ? List.of() :
                m.getMovieTypes().stream()
                        .map(mt -> mt.getType().getTypeName())
                        .toList();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("Title", m.getMovieNameEnglish());
        map.put("Year", m.getFromDate() != null ? String.valueOf(
                m.getFromDate().toInstant().atZone(ZoneId.systemDefault()).getYear()
        ) : "");
        map.put("imdbID", m.getMovieId());
        map.put("Type", types);
        map.put("Poster", m.getLargeImage());
        map.put("fromDate", m.getFromDate());
        map.put("toDate", m.getToDate());
        return map;
    }).toList();

    Map<String, Object> response = new LinkedHashMap<>();
    response.put("Search", searchResults);
    response.put("totalResults", String.valueOf(searchResults.size()));
    response.put("Response", "True");

    return ResponseEntity.ok(response);
}

public ResponseEntity<?> getComingSoonMovies() {
    Date now = new Date();
    List<Movie> movies = movieRepository.findAll().stream()
            .filter(m -> m.getFromDate() != null && m.getFromDate().after(now))
            .toList();

    List<Map<String, Object>> searchResults = movies.stream().map(m -> {
        List<String> types = m.getMovieTypes() == null ? List.of() :
                m.getMovieTypes().stream()
                        .map(mt -> mt.getType().getTypeName())
                        .toList();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("Title", m.getMovieNameEnglish());
        map.put("Year", m.getFromDate() != null ? String.valueOf(
                m.getFromDate().toInstant().atZone(ZoneId.systemDefault()).getYear()
        ) : "");
        map.put("imdbID", m.getMovieId());
        map.put("Type", types);
        map.put("Poster", m.getLargeImage());
        map.put("fromDate", m.getFromDate());
        map.put("toDate", m.getToDate());
        return map;
    }).toList();

    Map<String, Object> response = new LinkedHashMap<>();
    response.put("Search", searchResults);
    response.put("totalResults", String.valueOf(searchResults.size()));
    response.put("Response", "True");

    return ResponseEntity.ok(response);
}

private MovieDTO toMovieDTO(Movie movie) {
    return MovieDTO.builder()
            .movieId(movie.getMovieId())
            .movieNameEnglish(movie.getMovieNameEnglish())
            .movieNameVn(movie.getMovieNameVn())
            .director(movie.getDirector())
            .actor(movie.getActor())
            .duration(movie.getDuration())
            .fromDate(movie.getFromDate())
            .toDate(movie.getToDate())
            .content(movie.getContent())
            .largeImage(movie.getLargeImage())
            .smallImage(movie.getSmallImage())
            .types(movie.getMovieTypes() == null ? List.of() :
                    movie.getMovieTypes().stream()
                            .map(mt -> mt.getType().getTypeName())
                            .toList())
            .cinemaRoomId(movie.getCinemaRoom() != null ? movie.getCinemaRoom().getCinemaRoomId() : null)
            .cinemaRoomName(movie.getCinemaRoom() != null ? movie.getCinemaRoom().getRoomName() : null)
            .version(movie.getVersion())
            .movieProductionCompany(movie.getMovieProductionCompany())
            .build();
}
}