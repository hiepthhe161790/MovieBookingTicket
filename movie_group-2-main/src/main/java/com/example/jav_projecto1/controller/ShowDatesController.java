package com.example.jav_projecto1.controller;

import com.example.jav_projecto1.entities.ShowDates;
import com.example.jav_projecto1.respiratory.ShowDatesRepository;
import com.example.jav_projecto1.dto.ShowDatesDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/show-dates")
public class ShowDatesController {
    private final ShowDatesRepository showDatesRepository;

    public ShowDatesController(ShowDatesRepository showDatesRepository) {
        this.showDatesRepository = showDatesRepository;
    }

    @GetMapping
    public List<ShowDatesDTO> getAll() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return showDatesRepository.findAll().stream().map(sd -> ShowDatesDTO.builder()
                .showDateId(sd.getShowDateId())
                .dateName(sd.getDateName())
                .showDate(sd.getShowDate() != null ? sdf.format(sd.getShowDate()) : null)
                .build()
        ).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShowDatesDTO> getById(@PathVariable Integer id) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Optional<ShowDates> sd = showDatesRepository.findById(id);
        return sd.map(s -> ResponseEntity.ok(
                ShowDatesDTO.builder()
                        .showDateId(s.getShowDateId())
                        .dateName(s.getDateName())
                        .showDate(s.getShowDate() != null ? sdf.format(s.getShowDate()) : null)
                        .build()
        )).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ShowDates showDates) {
        if (showDates == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Dữ liệu không hợp lệ"));
        }
        ShowDates saved = showDatesRepository.save(showDates);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        ShowDatesDTO dto = ShowDatesDTO.builder()
                .showDateId(saved.getShowDateId())
                .dateName(saved.getDateName())
                .showDate(saved.getShowDate() != null ? sdf.format(saved.getShowDate()) : null)
                .build();
        return ResponseEntity.status(201).body(Map.of("message", "Tạo ShowDates thành công", "data", dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody ShowDates showDates) {
        if (!showDatesRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy ShowDates"));
        }
        showDates.setShowDateId(id);
        ShowDates updated = showDatesRepository.save(showDates);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        ShowDatesDTO dto = ShowDatesDTO.builder()
                .showDateId(updated.getShowDateId())
                .dateName(updated.getDateName())
                .showDate(updated.getShowDate() != null ? sdf.format(updated.getShowDate()) : null)
                .build();
        return ResponseEntity.ok(Map.of("message", "Cập nhật ShowDates thành công", "data", dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!showDatesRepository.existsById(id)) {
            return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy ShowDates"));
        }
        showDatesRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa ShowDates thành công"));
    }
}