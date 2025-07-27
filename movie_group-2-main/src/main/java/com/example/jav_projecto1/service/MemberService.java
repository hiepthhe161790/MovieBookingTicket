package com.example.jav_projecto1.service;


import org.springframework.stereotype.Service;

import com.example.jav_projecto1.dto.RegisterRequest;
import com.example.jav_projecto1.entities.Account;
import com.example.jav_projecto1.entities.Member;
import com.example.jav_projecto1.enumm.Role_enum;
import com.example.jav_projecto1.respiratory.MemberRepository;

@Service
public class MemberService {
    public final MemberRepository memberRepository;
    public final AccountService accountService;

    public MemberService (MemberRepository memberRepository,AccountService accountService)
    {
        this.memberRepository = memberRepository;
        this.accountService= accountService;
    }

    public Member saveByRequest(RegisterRequest registerRequest) {
        Account account = accountService.saveByRequest(registerRequest, Role_enum.EMPLOYEE);
        Member member = Member.builder().account(account).score(0).build();
        return memberRepository.save(member);
    }
}
