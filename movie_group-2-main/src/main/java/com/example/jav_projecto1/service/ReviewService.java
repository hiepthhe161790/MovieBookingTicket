package com.example.jav_projecto1.service;

import com.example.jav_projecto1.entities.*;
import com.example.jav_projecto1.respiratory.*;
import com.example.jav_projecto1.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final AccountRespiratory accountRespiratory;
    private final InvoiceRepository invoiceRepository;

    public ReviewService(ReviewRepository reviewRepository, MovieRepository movieRepository, AccountRespiratory accountRespiratory, InvoiceRepository invoiceRepository) {
        this.reviewRepository = reviewRepository;
        this.movieRepository = movieRepository;
        this.accountRespiratory = accountRespiratory;
        this.invoiceRepository = invoiceRepository;
    }

    public ResponseEntity<?> submitReview(ReviewRequest req) {
        Optional<Movie> movieOpt = movieRepository.findById(req.getMovieId());
        Optional<Account> accOpt = accountRespiratory.findById(req.getAccountId());
        if (movieOpt.isEmpty() || accOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Movie or Account not found");
        }
        String movieName = movieOpt.get().getMovieNameEnglish();
        boolean hasBought = invoiceRepository.hasUserBoughtTicketForMovie(req.getAccountId(), movieName);
        if (!hasBought) {
            return ResponseEntity.badRequest().body("Bạn cần mua vé xem phim này trước khi đánh giá!");
        }
        List<Review> existing = reviewRepository.findByMovie_MovieId(req.getMovieId()).stream()
                .filter(r -> r.getAccount().getAccountId().equals(req.getAccountId()))
                .toList();
        if (!existing.isEmpty()) {
            return ResponseEntity.badRequest().body("Bạn đã đánh giá phim này rồi!");
        }
        Review review = Review.builder()
                .movie(movieOpt.get())
                .account(accOpt.get())
                .rating(req.getRating())
                .comment(req.getComment())
                .createdAt(new java.sql.Timestamp(System.currentTimeMillis()))
                .build();
        reviewRepository.save(review);
        return ResponseEntity.ok("Review submitted");
    }

    public ResponseEntity<?> getAverageRating(String movieId) {
        Double avg = reviewRepository.findAverageRatingByMovieId(movieId);
        if (avg == null) avg = 0.0;
        Map<String, Object> resp = new HashMap<>();
        resp.put("movieId", movieId);
        resp.put("averageRating", avg);
        resp.put("totalReviews", reviewRepository.findByMovie_MovieId(movieId).size());
        return ResponseEntity.ok(resp);
    }

    public ResponseEntity<?> getReviewsByMovie(String movieId) {
        List<Review> reviews = reviewRepository.findByMovie_MovieId(movieId);
        List<ReviewResponse> result = reviews.stream().map(r -> ReviewResponse.builder()
                .reviewId(r.getReviewId())
                .movieId(r.getMovie().getMovieId())
                .accountId(r.getAccount().getAccountId())
                .accountName(r.getAccount().getName())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build()
        ).toList();
        return ResponseEntity.ok(result);
    }

    public ResponseEntity<?> updateReview(Long reviewId, ReviewRequest req) {
        Optional<Review> reviewOpt = reviewRepository.findById(reviewId);
        if (reviewOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Review review = reviewOpt.get();
        review.setRating(req.getRating());
        review.setComment(req.getComment());
        reviewRepository.save(review);
        return ResponseEntity.ok("Review updated");
    }

    public ResponseEntity<?> deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            return ResponseEntity.notFound().build();
        }
        reviewRepository.deleteById(reviewId);
        return ResponseEntity.ok("Review deleted");
    }
}