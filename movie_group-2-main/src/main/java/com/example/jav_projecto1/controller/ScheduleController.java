package com.example.jav_projecto1.controller;

import com.example.jav_projecto1.entities.Schedule;
import com.example.jav_projecto1.respiratory.ScheduleRepository;
import com.example.jav_projecto1.dto.ScheduleDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {
    private final ScheduleRepository scheduleRepository;
    @Autowired
    private com.example.jav_projecto1.respiratory.MovieDateRepository movieDateRepository;
    @Autowired
    private com.example.jav_projecto1.respiratory.MovieScheduleRepository movieScheduleRepository;

    public ScheduleController(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    @GetMapping
    public List<ScheduleDTO> getAll() {
        return scheduleRepository.findAll().stream().map(sc -> ScheduleDTO.builder()
                .scheduleId(sc.getScheduleId())
                .scheduleTime(sc.getScheduleTime())
                .build()
        ).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleDTO> getById(@PathVariable Integer id) {
        Optional<Schedule> sc = scheduleRepository.findById(id);
        return sc.map(s -> ResponseEntity.ok(
                ScheduleDTO.builder()
                        .scheduleId(s.getScheduleId())
                        .scheduleTime(s.getScheduleTime())
                        .build()
        )).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Schedule schedule) {
        if (schedule == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Dữ liệu không hợp lệ"));
        }
        Schedule saved = scheduleRepository.save(schedule);
        ScheduleDTO dto = ScheduleDTO.builder()
                .scheduleId(saved.getScheduleId())
                .scheduleTime(saved.getScheduleTime())
                .build();
        return ResponseEntity.status(201).body(Map.of("message", "Tạo Schedule thành công", "data", dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Schedule schedule) {
        if (!scheduleRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy Schedule"));
        }
        schedule.setScheduleId(id);
        Schedule updated = scheduleRepository.save(schedule);
        ScheduleDTO dto = ScheduleDTO.builder()
                .scheduleId(updated.getScheduleId())
                .scheduleTime(updated.getScheduleTime())
                .build();
        return ResponseEntity.ok(Map.of("message", "Cập nhật Schedule thành công", "data", dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!scheduleRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy Schedule"));
        }
        scheduleRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa Schedule thành công"));
    }

    @GetMapping("/by-movie-date")
    public ResponseEntity<?> getSchedulesByMovieAndDate(
            @RequestParam String movieId,
            @RequestParam Integer showDateId
    ) {
        // Kiểm tra movie-date có tồn tại không
        Optional<com.example.jav_projecto1.entities.MovieDate> movieDateOpt =
                movieDateRepository.findById(new com.example.jav_projecto1.entities.MovieDateId(movieId, showDateId));
        if (movieDateOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy movie-date"));
        }
        // Lấy các schedule của movie này
        List<com.example.jav_projecto1.entities.MovieSchedule> movieSchedules =
                movieScheduleRepository.findAll().stream()
                        .filter(ms -> ms.getMovie().getMovieId().equals(movieId))
                        .toList();

        List<ScheduleDTO> result = movieSchedules.stream()
                .map(ms -> ScheduleDTO.builder()
                        .scheduleId(ms.getSchedule().getScheduleId())
                        .scheduleTime(ms.getSchedule().getScheduleTime())
                        .build())
                .toList();

        return ResponseEntity.ok(result);
    }
}