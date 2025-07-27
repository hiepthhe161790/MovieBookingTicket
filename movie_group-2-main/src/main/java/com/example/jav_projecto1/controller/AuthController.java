package com.example.jav_projecto1.controller;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.jav_projecto1.dto.LoginRequest;
import com.example.jav_projecto1.dto.RegisterRequest;
import com.example.jav_projecto1.entities.Account;
import com.example.jav_projecto1.entities.Member;
import com.example.jav_projecto1.service.AccountService;
import com.example.jav_projecto1.service.MemberService;
import com.example.jav_projecto1.dto.LoginResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final AccountService accountService;
    private final MemberService memberService;

    public AuthController(AccountService accountService, MemberService memberService) {
        this.accountService = accountService;
        this.memberService = memberService;
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest registerRequest, HttpSession session) {
        try {
            Member member = memberService.saveByRequest(registerRequest);
            Account savedAcc = member.getAccount();
            if (savedAcc == null) {
                return ResponseEntity.badRequest().build();
            }
            session.setAttribute("userLogin", savedAcc);
            LoginResponse resp = LoginResponse.builder()
                    .accountId(savedAcc.getAccountId())
                    .username(savedAcc.getUsername())
                    .email(savedAcc.getEmail())
                    .name(savedAcc.getName())
                    .role(savedAcc.getRole() != null ? savedAcc.getRole().getRoleName().name() : null)
                    .phoneNumber(savedAcc.getPhoneNumber())
                    .address(savedAcc.getAddress())
                    .birthday(savedAcc.getBirthday())
                    .gender(savedAcc.getGender())
                    .build();
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException e) {
              e.printStackTrace(); 
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request, HttpSession session) {
        Optional<Account> accOpt = accountService.login(request.getUsername(), request.getPassword());
        if (accOpt.isPresent()) {
            Account acc = accOpt.get();
            session.setAttribute("userLogin", acc);

            // Log a success message with key user details
            logger.info("User logged in successfully: id={}, username={}, role={}, email={}",
                    acc.getAccountId(),
                    acc.getUsername(),
                    acc.getRole() != null ? acc.getRole().getRoleName().name() : "None",
                    acc.getEmail());

            LoginResponse resp = LoginResponse.builder()
                    .accountId(acc.getAccountId())
                    .username(acc.getUsername())
                    .email(acc.getEmail())
                    .name(acc.getName())
                    .role(acc.getRole() != null ? acc.getRole().getRoleName().name() : null)
                    .phoneNumber(acc.getPhoneNumber())
                    .address(acc.getAddress())
                    .birthday(acc.getBirthday())
                    .gender(acc.getGender())
                    .build();
            return ResponseEntity.ok(resp);
        }

        // Log a warning for a failed login attempt
        logger.warn("Failed login attempt for username: {}", request.getUsername());
        return ResponseEntity.badRequest().body(null);
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.removeAttribute("userLogin");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/personal")
    public ResponseEntity<LoginResponse> getPersonalPage(HttpSession session) {
        Account acc = (Account) session.getAttribute("userLogin");
        if (acc == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }
        LoginResponse resp = LoginResponse.builder()
                .accountId(acc.getAccountId())
                .username(acc.getUsername())
                .email(acc.getEmail())
                .name(acc.getName())
                .role(acc.getRole() != null ? acc.getRole().getRoleName().name() : null)
                .phoneNumber(acc.getPhoneNumber())
                .address(acc.getAddress())
                .birthday(acc.getBirthday())
                .gender(acc.getGender())
                .build();
        return ResponseEntity.ok(resp);
    }
}