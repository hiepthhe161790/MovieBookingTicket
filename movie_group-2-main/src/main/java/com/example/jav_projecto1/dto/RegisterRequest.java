package com.example.jav_projecto1.dto;

import java.time.LocalDate;

import com.example.jav_projecto1.enumm.Gender;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String name;
    private LocalDate birthday;
    private Gender gender;
    private String identityCard;
    private String phoneNumber;
    private String address;
}
