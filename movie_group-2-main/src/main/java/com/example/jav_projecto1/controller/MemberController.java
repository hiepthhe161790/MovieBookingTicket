package com.example.jav_projecto1.controller;

import com.example.jav_projecto1.entities.Member;
import com.example.jav_projecto1.entities.RewardPoint;
import com.example.jav_projecto1.respiratory.MemberRepository;
import com.example.jav_projecto1.respiratory.RewardPointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.jav_projecto1.dto.RewardPointHistoryDTO;

import java.util.List;
import java.util.stream.Collectors;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/member")
public class MemberController {
    private final MemberRepository memberRepository;
    @Autowired
    private RewardPointRepository rewardPointRepository;

    public MemberController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @GetMapping("/points/{accountId}")
    public ResponseEntity<?> getMemberPoints(@PathVariable Long accountId) {
        Optional<Member> memberOpt = memberRepository.findByAccount_AccountId(accountId);
        if (memberOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of("points", 0));
        }
        Member member = memberOpt.get();
        return ResponseEntity.ok(Map.of("points", member.getScore()));
    }

    @PutMapping("/points/deduct/{accountId}")
    public ResponseEntity<?> deductPoints(@PathVariable Long accountId, @RequestParam int points) {
        Optional<Member> memberOpt = memberRepository.findByAccount_AccountId(accountId);
        if (memberOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy thành viên"));
        }
        Member member = memberOpt.get();
        int current = member.getScore();
        if (points <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Số điểm trừ phải lớn hơn 0"));
        }
        if (current < points) {
            return ResponseEntity.badRequest().body(Map.of("message", "Không đủ điểm để trừ"));
        }
        member.setScore(current - points);
        memberRepository.save(member);
        RewardPoint rewardPoint = new RewardPoint();
rewardPoint.setMember(member);
rewardPoint.setPoints(points);
rewardPoint.setRewardDate(java.time.LocalDate.now());
rewardPoint.setType("DEDUCT"); // trừ điểm
rewardPointRepository.save(rewardPoint);
        return ResponseEntity.ok(Map.of("points", member.getScore()));
    }

   @GetMapping("/points/history/{accountId}")
public ResponseEntity<?> getPointHistory(@PathVariable Long accountId) {
    Optional<Member> memberOpt = memberRepository.findByAccount_AccountId(accountId);
    if (memberOpt.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy thành viên"));
    }
    Member member = memberOpt.get();
    List<RewardPoint> history = rewardPointRepository.findByMember_MemberIdOrderByRewardDateDesc(member.getMemberId());
   List<RewardPointHistoryDTO> dtoList = history.stream()
        .map(rp -> RewardPointHistoryDTO.builder()
                .rewardId(rp.getRewardId())
                .points(rp.getPoints())
                .rewardDate(rp.getRewardDate())
                .type(rp.getType())
                .build())
        .collect(Collectors.toList());
    return ResponseEntity.ok(dtoList);
}
} 