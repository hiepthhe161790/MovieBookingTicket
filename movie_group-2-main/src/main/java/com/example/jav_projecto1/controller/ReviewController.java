package com.example.jav_projecto1.controller;

import com.example.jav_projecto1.entities.Review;
import com.example.jav_projecto1.entities.Movie;
import com.example.jav_projecto1.entities.Account;
import com.example.jav_projecto1.respiratory.ReviewRepository;
import com.example.jav_projecto1.respiratory.MovieRepository;
import com.example.jav_projecto1.respiratory.AccountRespiratory;
import com.example.jav_projecto1.respiratory.InvoiceRepository;
import com.example.jav_projecto1.dto.ReviewRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.jav_projecto1.dto.ReviewResponse;
import java.util.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final AccountRespiratory accountRespiratory;
    private final InvoiceRepository invoiceRepository;
    public ReviewController(ReviewRepository reviewRepository, MovieRepository movieRepository, AccountRespiratory accountRespiratory, InvoiceRepository invoiceRepository) {
        this.reviewRepository = reviewRepository;
        this.movieRepository = movieRepository;
        this.accountRespiratory = accountRespiratory;
        this.invoiceRepository = invoiceRepository;
    }

    // Gửi đánh giá phim
    @PostMapping
    public ResponseEntity<?> submitReview(@RequestBody ReviewRequest req) {
        Optional<Movie> movieOpt = movieRepository.findById(req.getMovieId());
        Optional<Account> accOpt = accountRespiratory.findById(req.getAccountId());
        if (movieOpt.isEmpty() || accOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Movie or Account not found");
        }
        // Kiểm tra đã mua vé chưa
       String movieName = movieOpt.get().getMovieNameEnglish();
       boolean hasBought = invoiceRepository.hasUserBoughtTicketForMovie(req.getAccountId(), movieName);
       if (!hasBought) {
           return ResponseEntity.badRequest().body("Bạn cần mua vé xem phim này trước khi đánh giá!");
       }
        // Kiểm tra đã đánh giá chưa
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

    // Xem điểm trung bình của phim
  @GetMapping("/average")
    public ResponseEntity<?> getAverageRating(@RequestParam String movieId) {
        Double avg = reviewRepository.findAverageRatingByMovieId(movieId);
        if (avg == null) avg = 0.0;
        Map<String, Object> resp = new HashMap<>();
        resp.put("movieId", movieId);
        resp.put("averageRating", avg);
        resp.put("totalReviews", reviewRepository.findByMovie_MovieId(movieId).size());
        return ResponseEntity.ok(resp);
    }
    // Lấy tất cả đánh giá của phim
   @GetMapping
    public ResponseEntity<?> getReviewsByMovie(@RequestParam String movieId) {
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


    // Sửa đánh giá phim
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest req) {
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

    // Xóa đánh giá phim
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            return ResponseEntity.notFound().build();
        }
        reviewRepository.deleteById(reviewId);
        return ResponseEntity.ok("Review deleted");
    }
}