package com.example.jav_projecto1.respiratory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import com.example.jav_projecto1.entities.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByAccount_AccountId(Long accountId);
}
