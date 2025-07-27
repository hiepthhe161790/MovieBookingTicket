package com.example.jav_projecto1.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.jav_projecto1.dto.RegisterRequest;
import com.example.jav_projecto1.entities.Account;
import com.example.jav_projecto1.entities.Role;
import com.example.jav_projecto1.enumm.Role_enum;
import com.example.jav_projecto1.respiratory.AccountRespiratory;
import com.example.jav_projecto1.respiratory.RoleRepository;

@Service
public class AccountService {

    private final AccountRespiratory accRespiratory;
    private final RoleRepository roleRepository;

    public AccountService(AccountRespiratory accountRespiratory, RoleRepository roleRepository) {
        this.accRespiratory = accountRespiratory;
        this.roleRepository = roleRepository;
    }

    public Account saveByRequest(RegisterRequest registerRequest, Role_enum role) {
        Role role2 = roleRepository.findByRoleName(role);
        Account newAccount = Account.builder()
                .username(registerRequest.getUsername())
                .password(registerRequest.getPassword())
                .email(registerRequest.getEmail())
                .name(registerRequest.getName())
                .birthday(registerRequest.getBirthday())
                .gender(registerRequest.getGender())
                .identityCard(registerRequest.getIdentityCard())
                .phoneNumber(registerRequest.getPhoneNumber())
                .address(registerRequest.getAddress())
                .registerDate(LocalDate.now()) // setting registration date as current date
                .status(true) // setting a default status
                .role(role2)
                .build();

        return accRespiratory.save(newAccount);
    }

    public Optional<Account> login(String username, String password) {
        Optional<Account> acc_optn = accRespiratory.findByUsername(username);

        if (acc_optn.isPresent()) {
            Account acc = acc_optn.get();
            if (acc.getPassword().equals(password)) {
                return Optional.of(acc);
            }
        }

        return Optional.empty();
    }

    public Account registerUser(Account newacc) {
        if (accRespiratory.findByUsername(newacc.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username has been already taken!");
        }
        return accRespiratory.save(newacc);
    }
}
