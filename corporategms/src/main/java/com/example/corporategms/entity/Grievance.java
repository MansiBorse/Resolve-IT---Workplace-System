package com.example.corporategms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "grievance")
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ticketId;
    private String employeeEmail;
    private String title;
    private String priority;
    private String department;

    @Column(length = 1000)
    private String description;

    private String attachment;

    // ✅ NEW: stores the actual file path on server
    private String attachmentUrl;

    private String status = "Pending";

    private LocalDateTime createdAt = LocalDateTime.now();

    private String resolutionNote;
    private LocalDateTime resolvedAt;

    private String category;
    private Boolean isAnonymous = false;

    public Grievance() {}

    public Long getId() { return id; }

    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }

    public String getEmployeeEmail() { return employeeEmail; }
    public void setEmployeeEmail(String employeeEmail) { this.employeeEmail = employeeEmail; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAttachment() { return attachment; }
    public void setAttachment(String attachment) { this.attachment = attachment; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getResolutionNote() { return resolutionNote; }
    public void setResolutionNote(String resolutionNote) { this.resolutionNote = resolutionNote; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }
}