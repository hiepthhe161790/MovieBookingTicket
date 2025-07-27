package com.example.jav_projecto1.dto;

import java.time.LocalDate;
import com.example.jav_projecto1.enumm.Gender;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Long accountId;
    private String username;
    private String email;
    private String name;
    private String role;
    private String phoneNumber;
    private String address;
    private LocalDate birthday;
    private Gender gender;
}