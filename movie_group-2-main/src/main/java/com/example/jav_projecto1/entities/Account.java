package com.example.jav_projecto1.entities;

import java.time.LocalDate;
import java.util.List;

import com.example.jav_projecto1.enumm.Gender;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.GenerationType;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    private String address;
    private LocalDate birthday;
    private String email;
    private String name;

    @Enumerated(EnumType.STRING)
    private Gender gender;
    private String identityCard;
    private String image;
    private String password;
    private String phoneNumber;
    private LocalDate registerDate;
    private Boolean status;
    @Column(unique = true, nullable = false)
    private String username;

    @ManyToOne
    @JoinColumn(name = "roleId")
    private Role role;

    @OneToMany(mappedBy = "account")
    private List<Invoice> invoices;

    @OneToOne(mappedBy = "account")
    private Member member;

    @OneToOne(mappedBy = "account")
    private Employee employee;
}
