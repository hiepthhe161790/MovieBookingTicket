package com.example.jav_projecto1.service;

import com.example.jav_projecto1.entities.Type;
import com.example.jav_projecto1.respiratory.TypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TypeService {
    private final TypeRepository typeRepository;

    public TypeService(TypeRepository typeRepository) {
        this.typeRepository = typeRepository;
    }

    public List<Type> getAllTypes() {
        return typeRepository.findAll();
    }

    public Optional<Type> getTypeById(Integer id) {
        return typeRepository.findById(id);
    }

    public Type createType(Type type) {
        return typeRepository.save(type);
    }

    public Optional<Type> updateType(Integer id, Type typeDetails) {
        Optional<Type> typeOpt = typeRepository.findById(id);
        if (typeOpt.isEmpty()) {
            return Optional.empty();
        }
        Type type = typeOpt.get();
        type.setTypeName(typeDetails.getTypeName());
        return Optional.of(typeRepository.save(type));
    }

    public boolean deleteType(Integer id) {
        if (!typeRepository.existsById(id)) {
            return false;
        }
        typeRepository.deleteById(id);
        return true;
    }
}