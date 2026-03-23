package com.example.corporategms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeName;
    private String department;
    private String experience;

    @Column(length = 1000)
    private String message;

    private int rating;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Feedback() {}

    public Long getId() { return id; }

    public String getEmployeeName() { return employeeName; }

    public String getDepartment() { return department; }

    public String getExperience() { return experience; }

    public String getMessage() { return message; }

    public int getRating() { return rating; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }

    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public void setDepartment(String department) { this.department = department; }

    public void setExperience(String experience) { this.experience = experience; }

    public void setMessage(String message) { this.message = message; }

    public void setRating(int rating) { this.rating = rating; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}