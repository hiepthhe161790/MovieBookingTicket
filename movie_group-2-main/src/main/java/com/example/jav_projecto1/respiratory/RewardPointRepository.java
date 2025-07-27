package com.example.jav_projecto1.respiratory;

import com.example.jav_projecto1.entities.RewardPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RewardPointRepository extends JpaRepository<RewardPoint, Long> {
List<RewardPoint> findByMember_MemberIdOrderByRewardDateDesc(Long memberId);
} 