package com.example.corporategms.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.corporategms.entity.Feedback;
import com.example.corporategms.repository.FeedbackRepository;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository repository;

    public Feedback saveFeedback(Feedback feedback){
        return repository.save(feedback);
    }

    public List<Feedback> getAllFeedback(){
        return repository.findAll();
    }
}