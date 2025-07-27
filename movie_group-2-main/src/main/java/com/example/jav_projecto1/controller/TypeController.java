package com.example.jav_projecto1.controller;

import com.example.jav_projecto1.entities.Type;
import com.example.jav_projecto1.respiratory.TypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.example.jav_projecto1.service.TypeService;
@RestController
@RequestMapping("/api/types")
public class TypeController {

    private final TypeService typeService;

    public TypeController(TypeService typeService) {
        this.typeService = typeService;
    }

    @GetMapping
    public List<Type> getAllTypes() {
        return typeService.getAllTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Type> getTypeById(@PathVariable Integer id) {
        return typeService.getTypeById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Type createType(@RequestBody Type type) {
        return typeService.createType(type);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Type> updateType(@PathVariable Integer id, @RequestBody Type typeDetails) {
        return typeService.updateType(id, typeDetails)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteType(@PathVariable Integer id) {
        if (!typeService.deleteType(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}