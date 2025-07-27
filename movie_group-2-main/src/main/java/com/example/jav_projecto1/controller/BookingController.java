package com.example.jav_projecto1.controller;

import com.example.jav_projecto1.entities.Invoice;
import com.example.jav_projecto1.entities.Movie;
import com.example.jav_projecto1.entities.Schedule;
import com.example.jav_projecto1.respiratory.*;
import com.example.jav_projecto1.entities.Account;
import com.example.jav_projecto1.entities.Member;
import com.example.jav_projecto1.entities.RewardPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.jav_projecto1.dto.MovieDTO;
import com.example.jav_projecto1.dto.InvoiceDTO;
import com.example.jav_projecto1.entities.MovieSchedule;
import com.example.jav_projecto1.entities.MovieDate;
import com.example.jav_projecto1.entities.ShowDates;
import com.example.jav_projecto1.dto.ShowtimeDTO;
import com.example.jav_projecto1.entities.Seat;
import com.example.jav_projecto1.entities.CinemaRoom;
import com.example.jav_projecto1.service.EmailService;
import com.example.jav_projecto1.service.BookingService;

import com.example.jav_projecto1.service.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.HttpServletRequest;
@RestController
@RequestMapping("/api/booking")
public class BookingController {

    private final BookingService bookingService;
    @Autowired
    private VNPayService vnPayService;
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/movies")
    public List<MovieDTO> getAllMovies() {
        return bookingService.getAllMovies();
    }

    @GetMapping("/schedules")
    public List<Schedule> getAllSchedules() {
        return bookingService.getAllSchedules();
    }

    @GetMapping("/seats")
    public List<String> getBookedSeats(@RequestParam String movieName, @RequestParam String scheduleShow) {
        return bookingService.getBookedSeats(movieName, scheduleShow);
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmBooking(@RequestBody Map<String, Object> invoiceData, @RequestParam Long accountId) {
        Invoice invoice = new Invoice();
        invoice.setMovieName((String) invoiceData.get("movieName"));
        invoice.setScheduleShow((String) invoiceData.get("scheduleShow"));
        invoice.setScheduleShowTime((String) invoiceData.get("scheduleShowTime"));
        invoice.setSeat((String) invoiceData.get("seat"));
        invoice.setStatus((Boolean) invoiceData.get("status"));
        if (invoiceData.get("totalMoney") != null) {
            invoice.setTotalMoney(((Number) invoiceData.get("totalMoney")).intValue());
        }
        if (invoiceData.get("addScore") != null) {
            invoice.setAddScore(((Number) invoiceData.get("addScore")).intValue());
        }
        if (invoiceData.get("useScore") != null) {
            invoice.setUseScore(((Number) invoiceData.get("useScore")).intValue());
        }
        invoice.setBookingDate(new java.sql.Timestamp(System.currentTimeMillis()));
        System.out.println("Received invoiceData: " + invoiceData);
        return bookingService.confirmBooking(invoice, accountId);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getBookingHistory(@RequestParam Long accountId) {
        return bookingService.getBookingHistory(accountId);
    }

    @GetMapping("/ticket/{invoiceId}")
    public ResponseEntity<?> getTicketInfo(@PathVariable Long invoiceId) {
        return bookingService.getTicketInfo(invoiceId);
    }

    @GetMapping("/schedules/{movieId}")
    public ResponseEntity<List<Schedule>> getSchedulesByMovieId(@PathVariable String movieId) {
        return bookingService.getSchedulesByMovieId(movieId);
    }

    @GetMapping("/showtimes/{movieId}")
    public ResponseEntity<List<Map<String, Object>>> getShowtimesByMovieId(@PathVariable String movieId) {
        return bookingService.getShowtimesByMovieId(movieId);
    }

    @GetMapping("/seat-status")
    public ResponseEntity<?> getSeatStatus(
            @RequestParam String movieId,
            @RequestParam Integer showDateId,
            @RequestParam Integer scheduleId
    ) {
        return bookingService.getSeatStatus(movieId, showDateId, scheduleId);
    }
    @PostMapping("/payment-link")
    public ResponseEntity<?> createPaymentLink(@RequestBody Map<String, Object> invoiceData, HttpServletRequest request) {
        int amount = ((Number) invoiceData.get("totalMoney")).intValue();
        String orderInfo = (String) invoiceData.get("movieName") + " - " + invoiceData.get("scheduleShow") + " - " + invoiceData.get("seat");
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String paymentUrl = vnPayService.createOrder(amount, orderInfo, baseUrl);
        return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
    }
}