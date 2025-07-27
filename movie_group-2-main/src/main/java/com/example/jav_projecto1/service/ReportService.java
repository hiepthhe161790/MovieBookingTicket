package com.example.jav_projecto1.service;

import com.example.jav_projecto1.respiratory.InvoiceRepository;
import com.example.jav_projecto1.respiratory.MovieRepository;
import com.example.jav_projecto1.respiratory.CinemaRoomRepository;
import com.example.jav_projecto1.respiratory.ReviewRepository;
import com.example.jav_projecto1.entities.Invoice;
import com.example.jav_projecto1.entities.Movie;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private final InvoiceRepository invoiceRepository;
    private final MovieRepository movieRepository;
    private final CinemaRoomRepository cinemaRoomRepository;
    private final ReviewRepository reviewRepository;

    public ReportService(
            InvoiceRepository invoiceRepository,
            MovieRepository movieRepository,
            CinemaRoomRepository cinemaRoomRepository,
            ReviewRepository reviewRepository
    ) {
        this.invoiceRepository = invoiceRepository;
        this.movieRepository = movieRepository;
        this.cinemaRoomRepository = cinemaRoomRepository;
        this.reviewRepository = reviewRepository;
    }

    public Map<String, Object> getOverview() {
        int totalTickets = (int) invoiceRepository.count();

        int totalRevenue = invoiceRepository.findAll().stream()
                .mapToInt(inv -> inv.getTotalMoney() != null ? inv.getTotalMoney() : 0)
                .sum();

        Date now = new Date();
        int showingMovies = (int) movieRepository.findAll().stream()
                .filter(m -> m.getFromDate() != null && m.getToDate() != null
                        && !now.before(m.getFromDate()) && !now.after(m.getToDate()))
                .count();

        int cinemaRooms = (int) cinemaRoomRepository.count();

        List<Map<String, Object>> stats = List.of(
                Map.of("label", "Tổng vé đã bán", "value", totalTickets),
                Map.of("label", "Tổng doanh thu", "value", "₫ " + String.format("%,d", totalRevenue)),
                Map.of("label", "Phim đang chiếu", "value", showingMovies),
                Map.of("label", "Phòng chiếu", "value", cinemaRooms)
        );

        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        List<Map<String, Object>> revenueData = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            final int currentMonth = month;
            int revenue = invoiceRepository.findAll().stream()
                    .filter(inv -> {
                        if (inv.getBookingDate() == null) return false;
                        Calendar cal2 = Calendar.getInstance();
                        cal2.setTime(inv.getBookingDate());
                        return cal2.get(Calendar.YEAR) == year && (cal2.get(Calendar.MONTH) + 1) == currentMonth;
                    })
                    .mapToInt(inv -> inv.getTotalMoney() != null ? inv.getTotalMoney() : 0)
                    .sum();
            revenueData.add(Map.of("month", String.valueOf(month), "value", revenue));
        }

        Map<String, Long> movieTicketCount = invoiceRepository.findAll().stream()
                .collect(Collectors.groupingBy(Invoice::getMovieName, Collectors.counting()));
        List<Map<String, Object>> topMovies = movieTicketCount.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("tickets", e.getValue());
                    Optional<Movie> movieOpt = movieRepository.findAll().stream()
                            .filter(movie -> e.getKey().equals(movie.getMovieNameEnglish()))
                            .findFirst();
                    if (movieOpt.isPresent()) {
                        String movieId = movieOpt.get().getMovieId();
                        Double avgRating = reviewRepository.findAverageRatingByMovieId(movieId);
                        if (avgRating == null) avgRating = 0.0;
                        int totalReviews = reviewRepository.findByMovie_MovieId(movieId).size();
                        m.put("averageRating", avgRating);
                        m.put("totalReviews", totalReviews);
                    } else {
                        m.put("averageRating", 0.0);
                        m.put("totalReviews", 0);
                    }
                    return m;
                })
                .collect(Collectors.toList());

        Map<String, Object> resp = new HashMap<>();
        resp.put("stats", stats);
        resp.put("revenueData", revenueData);
        resp.put("topMovies", topMovies);

        return resp;
    }
}