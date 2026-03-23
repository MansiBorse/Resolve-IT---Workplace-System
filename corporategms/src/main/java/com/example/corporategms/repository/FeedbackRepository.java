package com.example.corporategms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.corporategms.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

}