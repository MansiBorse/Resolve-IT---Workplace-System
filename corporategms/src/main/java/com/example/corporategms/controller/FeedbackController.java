package com.example.corporategms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.corporategms.entity.Feedback;
import com.example.corporategms.service.AuditLogService;
import com.example.corporategms.service.FeedbackService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    @Autowired
    private FeedbackService service;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public List<Feedback> getFeedback() {
        return service.getAllFeedback();
    }

    @PostMapping
    public Feedback addFeedback(@RequestBody Feedback feedback,
                                HttpServletRequest request) {
        Feedback saved = service.saveFeedback(feedback);

        // AUDIT LOG
        auditLogService.log(
            feedback.getEmployeeName() != null ? feedback.getEmployeeName() : "anonymous",
            "SUBMITTED_FEEDBACK",
            "Feedback",
            saved.getId().toString(),
            "Feedback submitted by: " + feedback.getEmployeeName(),
            request.getRemoteAddr()
        );

        return saved;
    }
}