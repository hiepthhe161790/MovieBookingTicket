package com.example.jav_projecto1.dto;

import com.example.jav_projecto1.enumm.Gender;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountDTO {
    private Long accountId;
    private String address;
    private LocalDate birthday;
    private String email;
    private String name;
    private Gender gender;
    private String identityCard;
    private String image;
    // Omit password for security reasons
    private String phoneNumber;
    private LocalDate registerDate;
    private Boolean status;
    private String username;
    private String role;  // could be the role's name (for example, "ADMIN")
}
