package com.example.jav_projecto1.respiratory;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.jav_projecto1.entities.Account;

public interface AccountRespiratory extends JpaRepository<Account, Long> {
    Optional<Account> findByUsernameAndPassword(String username, String password);
    Optional<Account> findByUsername(String username);
}
