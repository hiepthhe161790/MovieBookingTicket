package com.example.jav_projecto1.service;

import com.example.jav_projecto1.entities.*;
import com.example.jav_projecto1.respiratory.*;
import com.example.jav_projecto1.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@Service
public class BookingService {
    private final MovieRepository movieRepository;
    private final ScheduleRepository scheduleRepository;
    private final InvoiceRepository invoiceRepository;
    private final AccountRespiratory accountRespiratory;
    private final SeatRepository seatRepository;
    private final CinemaRoomRepository cinemaRoomRepository;
    private final MemberRepository memberRepository;
    private final RewardPointRepository rewardPointRepository;
    private final EmailService emailService;

    public BookingService(
            EmailService emailService,
            MovieRepository movieRepository,
            ScheduleRepository scheduleRepository,
            InvoiceRepository invoiceRepository,
            AccountRespiratory accountRespiratory,
            SeatRepository seatRepository,
            CinemaRoomRepository cinemaRoomRepository,
            MemberRepository memberRepository,
            RewardPointRepository rewardPointRepository
    ) {
        this.movieRepository = movieRepository;
        this.scheduleRepository = scheduleRepository;
        this.invoiceRepository = invoiceRepository;
        this.accountRespiratory = accountRespiratory;
        this.seatRepository = seatRepository;
        this.cinemaRoomRepository = cinemaRoomRepository;
        this.memberRepository = memberRepository;
        this.rewardPointRepository = rewardPointRepository;
        this.emailService = emailService;
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
                        .build()
        ).toList();
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public List<String> getBookedSeats(String movieName, String scheduleShow) {
        return invoiceRepository.findBookedSeats(movieName, scheduleShow);
    }

   public ResponseEntity<?> confirmBooking(Invoice invoice, Long accountId) {
    Optional<Account> accOpt = accountRespiratory.findById(accountId);
    if (accOpt.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("message", "Tài khoản không tồn tại"));
    }

    Account account = accOpt.get();
    invoice.setAccount(account);

    // Kiểm tra invoice đã tồn tại chưa (theo movieName, scheduleShow, seat, account)
    boolean exists = invoiceRepository.findAll().stream()
        .anyMatch(inv ->
            inv.getAccount() != null &&
            inv.getAccount().getAccountId().equals(accountId) &&
            inv.getMovieName().equals(invoice.getMovieName()) &&
            inv.getScheduleShow().equals(invoice.getScheduleShow()) &&
            inv.getSeat().equals(invoice.getSeat())
        );

    invoiceRepository.save(invoice);

    emailService.sendBookingConfirmation(
            account.getEmail(),
            invoice.getMovieName(),
            invoice.getScheduleShow(),
            invoice.getSeat()
    );

    Optional<Member> memberOpt = memberRepository.findByAccount_AccountId(accountId);
    if (memberOpt.isPresent() && !exists) { // chỉ cộng điểm nếu chưa tồn tại invoice
        Member member = memberOpt.get();
        int pointsToAdd = 10;
        member.setScore(member.getScore() + pointsToAdd);
        memberRepository.save(member);

        RewardPoint rewardPoint = new RewardPoint();
        rewardPoint.setMember(member);
        rewardPoint.setPoints(pointsToAdd);
        rewardPoint.setRewardDate(LocalDate.now());
        rewardPoint.setType("ADD"); 
        rewardPointRepository.save(rewardPoint);
    }

    return ResponseEntity.ok(Map.of("message", "Đặt vé thành công"));
}

    public ResponseEntity<?> getBookingHistory(Long accountId) {
        Optional<Account> accOpt = accountRespiratory.findById(accountId);
        if (accOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tài khoản không tồn tại"));
        }
        List<InvoiceDTO> history = invoiceRepository.findAll().stream()
                .filter(inv -> inv.getAccount() != null && inv.getAccount().getAccountId().equals(accountId))
                .map(inv -> InvoiceDTO.builder()
                        .invoiceId(inv.getInvoiceId())
                        .movieName(inv.getMovieName())
                        .scheduleShow(inv.getScheduleShow())
                        .scheduleShowTime(inv.getScheduleShowTime())
                        .seat(inv.getSeat())
                        .totalMoney(inv.getTotalMoney())
                        .bookingDate(inv.getBookingDate())
                        .status(inv.getStatus())
                        .build())
                .toList();
        return ResponseEntity.ok(history);
    }

    public ResponseEntity<?> getTicketInfo(Long invoiceId) {
        Optional<Invoice> invoiceOpt = invoiceRepository.findById(invoiceId);
        if (invoiceOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Invoice invoice = invoiceOpt.get();

        String cinemaRoomName = null;
        String version = null;
        Optional<Movie> movieOpt = movieRepository.findAll().stream()
                .filter(m -> m.getMovieNameEnglish().equals(invoice.getMovieName()))
                .findFirst();
        if (movieOpt.isPresent()) {
            Movie movie = movieOpt.get();
            if (movie.getCinemaRoom() != null) {
                cinemaRoomName = movie.getCinemaRoom().getRoomName();
            }
            version = movie.getVersion();
        }

        Map<String, Object> dto = Map.of(
                "invoiceId", invoice.getInvoiceId(),
                "movieName", invoice.getMovieName(),
                "scheduleShow", invoice.getScheduleShow(),
                "scheduleShowTime", invoice.getScheduleShowTime(),
                "seat", invoice.getSeat(),
                "totalMoney", invoice.getTotalMoney(),
                "bookingDate", invoice.getBookingDate(),
                "status", invoice.getStatus(),
                "cinemaRoomName", cinemaRoomName,
                "version", version
        );
        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<List<Schedule>> getSchedulesByMovieId(String movieId) {
        Optional<Movie> movieOpt = movieRepository.findById(movieId);
        if (movieOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Movie movie = movieOpt.get();
        if (movie.getMovieSchedules() == null) {
            return ResponseEntity.ok(List.of());
        }
        List<Schedule> schedules = movie.getMovieSchedules().stream()
                .map(MovieSchedule::getSchedule)
                .toList();
        return ResponseEntity.ok(schedules);
    }

 public ResponseEntity<List<Map<String, Object>>> getShowtimesByMovieId(String movieId) {
    Optional<Movie> movieOpt = movieRepository.findById(movieId);
    if (movieOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    Movie movie = movieOpt.get();

    List<Map<String, Object>> showtimes = new ArrayList<>();
    List<MovieDate> movieDates = movie.getMovieDates();
    if (movieDates == null) movieDates = List.of();
    List<MovieSchedule> movieSchedules = movie.getMovieSchedules();
    if (movieSchedules == null) movieSchedules = List.of();
    CinemaRoom room = movie.getCinemaRoom();
    List<Seat> allSeats = room == null ? List.of() :
            seatRepository.findAll().stream()
                    .filter(seat -> seat.getCinemaRoom().getCinemaRoomId().equals(room.getCinemaRoomId()))
                    .toList();

    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    for (MovieDate md : movieDates) {
        ShowDates showDate = md.getShowDates();
        String showDateStr = showDate.getShowDate() != null ? dateFormat.format(showDate.getShowDate()) : null;
        for (MovieSchedule ms : movieSchedules) {
            Schedule schedule = ms.getSchedule();
            String movieName = movie.getMovieNameEnglish();
            String scheduleShow = showDateStr; // ngày chiếu
            String scheduleShowTime = schedule.getScheduleTime(); // giờ chiếu

            // Lấy danh sách ghế đã đặt cho đúng ngày và giờ
            List<String> bookedSeats = invoiceRepository.findAll().stream()
                    .filter(inv -> inv.getMovieName().trim().equals(movieName.trim())
                            && inv.getScheduleShow().trim().equals(scheduleShow.trim())
                            && inv.getScheduleShowTime().trim().equals(scheduleShowTime.trim()))
                    .flatMap(inv -> Arrays.stream(inv.getSeat().split(",")))
                    .map(String::trim)
                    .toList();

            long availableSeats = allSeats.stream()
                    .filter(seat -> !bookedSeats.contains(seat.getSeatCode()))
                    .count();

            Map<String, Object> map = new HashMap<>();
            map.put("scheduleId", schedule.getScheduleId());
            map.put("scheduleTime", schedule.getScheduleTime());
            map.put("showDateId", showDate.getShowDateId());
            map.put("showDate", showDateStr); // Đảm bảo trả về String yyyy-MM-dd
            map.put("dateName", showDate.getDateName());
            map.put("availableSeats", availableSeats);
            showtimes.add(map);
        }
    }
    return ResponseEntity.ok(showtimes);
}

    public ResponseEntity<?> getSeatStatus(String movieId, Integer showDateId, Integer scheduleId) {
        Optional<Movie> movieOpt = movieRepository.findById(movieId);
        if (movieOpt.isEmpty()) return ResponseEntity.notFound().build();
        Movie movie = movieOpt.get();

        CinemaRoom room = movie.getCinemaRoom();
        if (room == null) return ResponseEntity.badRequest().body("Phim chưa gán phòng chiếu");

        List<Seat> allSeats = seatRepository.findAll().stream()
                .filter(seat -> seat.getCinemaRoom().getCinemaRoomId().equals(room.getCinemaRoomId()))
                .toList();

        Optional<Schedule> scheduleOpt = scheduleRepository.findById(scheduleId);
        if (scheduleOpt.isEmpty()) return ResponseEntity.badRequest().body("Giờ chiếu không tồn tại");
        String scheduleShowTime = scheduleOpt.get().getScheduleTime(); // Giờ chiếu

        // Lấy ngày chiếu từ showDateId
        Optional<ShowDates> showDateOpt = movie.getMovieDates().stream()
                .map(MovieDate::getShowDates)
                .filter(sd -> sd.getShowDateId().equals(showDateId))
                .findFirst();
        if (showDateOpt.isEmpty()) return ResponseEntity.badRequest().body("Ngày chiếu không tồn tại");

        // Định dạng showDate từ Date thành String (yyyy-MM-dd)
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String showDateStr = dateFormat.format(showDateOpt.get().getShowDate());

        String movieName = movie.getMovieNameEnglish();
List<String> bookedSeats = invoiceRepository.findAll().stream()
        .filter(inv -> {
            boolean movieMatch = inv.getMovieName().trim().equals(movieName.trim());
            boolean dateMatch = inv.getScheduleShow().trim().equals(showDateStr.trim());
            boolean timeMatch = inv.getScheduleShowTime().trim().equals(scheduleShowTime.trim());
            System.out.println("Comparing Invoice: movieName=" + inv.getMovieName() + " (" + movieMatch + "), scheduleShow=" + inv.getScheduleShow() + " (" + dateMatch + "), scheduleShowTime=" + inv.getScheduleShowTime() + " (" + timeMatch + ")");
            return movieMatch && dateMatch && timeMatch;
        })
        .flatMap(inv -> Arrays.stream(inv.getSeat().split(",")))
        .map(String::trim)
        .toList();

        List<Map<String, Object>> result = allSeats.stream().map(seat -> {
            Map<String, Object> map = new HashMap<>();
            map.put("seatId", seat.getSeatId());
            map.put("seatCode", seat.getSeatCode());
            map.put("rowLabel", seat.getRowLabel());
            map.put("seatNumber", seat.getSeatNumber());
            map.put("seatType", seat.getSeatType());
            map.put("status", bookedSeats.contains(seat.getSeatCode()) ? "BOOKED" : "AVAILABLE");
            map.put("active", seat.getStatus());
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }
}