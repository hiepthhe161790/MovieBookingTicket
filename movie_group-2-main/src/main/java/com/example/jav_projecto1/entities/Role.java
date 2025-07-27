package com.example.jav_projecto1.entities;

import java.util.List;

import com.example.jav_projecto1.enumm.Role_enum;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;
@Entity
@Getter
@Setter
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;

    @Enumerated(EnumType.STRING)
    private Role_enum roleName;

    @OneToMany(mappedBy = "role")
    private List<Account> accounts;
}
