package com.example.corporategms.controller;

import com.example.corporategms.entity.Grievance;
import com.example.corporategms.entity.GrievanceHistory;
import com.example.corporategms.repository.GrievanceRepository;
import com.example.corporategms.repository.GrievanceHistoryRepository;
import com.example.corporategms.service.AuditLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/grievances")
@CrossOrigin(origins = "http://localhost:5173")
public class GrievanceController {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private GrievanceHistoryRepository historyRepository;

    @Autowired
    private AuditLogService auditLogService;

    // ✅ Folder where uploaded files are saved on server
    private final String UPLOAD_DIR = "uploads/grievances/";

    // ─────────────────────────────────────────
    // CREATE GRIEVANCE (with optional file upload)
    // ─────────────────────────────────────────
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public Grievance createGrievance(
            @RequestParam("employeeEmail") String employeeEmail,
            @RequestParam("title") String title,
            @RequestParam("priority") String priority,
            @RequestParam("department") String department,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "isAnonymous", defaultValue = "false") Boolean isAnonymous,
            @RequestParam(value = "file", required = false) MultipartFile file,
            HttpServletRequest request) throws IOException {

        Grievance grievance = new Grievance();
        grievance.setEmployeeEmail(employeeEmail);
        grievance.setTitle(title);
        grievance.setPriority(priority);
        grievance.setDepartment(department);
        grievance.setCategory(category);
        grievance.setDescription(description);
        grievance.setIsAnonymous(isAnonymous);
        grievance.setStatus("Pending");

        String ticketId = "GRV-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        grievance.setTicketId(ticketId);

        // ✅ Save file if provided
        if (file != null && !file.isEmpty()) {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Save with unique name to avoid conflicts
            String originalName = file.getOriginalFilename();
            String uniqueName = ticketId + "_" + originalName;
            Path filePath = uploadPath.resolve(uniqueName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            grievance.setAttachment(originalName);
            grievance.setAttachmentUrl(UPLOAD_DIR + uniqueName);
        }

        Grievance saved = grievanceRepository.save(grievance);

        GrievanceHistory history = new GrievanceHistory();
        history.setTicketId(saved.getTicketId());
        history.setStatus("Pending");
        history.setComment("Grievance submitted");
        history.setChangedBy(saved.getEmployeeEmail());
        historyRepository.save(history);

        auditLogService.log(
            saved.getEmployeeEmail(),
            "CREATED_GRIEVANCE",
            "Grievance",
            saved.getTicketId(),
            "Grievance submitted by: " + saved.getEmployeeEmail(),
            request.getRemoteAddr()
        );

        return saved;
    }

    // ─────────────────────────────────────────
    // ✅ VIEW / DOWNLOAD ATTACHMENT (Admin)
    // ─────────────────────────────────────────
    @GetMapping("/attachment/{ticketId}")
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable String ticketId,
            @RequestParam(defaultValue = "false") boolean download) throws IOException {

        Grievance grievance = grievanceRepository.findByTicketId(ticketId);
        if (grievance == null || grievance.getAttachmentUrl() == null) {
            return ResponseEntity.notFound().build();
        }

        Path filePath = Paths.get(grievance.getAttachmentUrl());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        String fileName = grievance.getAttachment();
        String contentType = "application/octet-stream";

        if (fileName != null) {
            if (fileName.endsWith(".pdf")) contentType = "application/pdf";
            else if (fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg"))
                contentType = "image/" + fileName.substring(fileName.lastIndexOf(".") + 1);
            else if (fileName.endsWith(".doc") || fileName.endsWith(".docx"))
                contentType = "application/msword";
        }

        HttpHeaders headers = new HttpHeaders();
        if (download) {
            // Force download
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
        } else {
            // Inline view (PDF preview in browser)
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"");
        }

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    // ─────────────────────────────────────────
    // GET ALL GRIEVANCES (Admin)
    // ─────────────────────────────────────────
    @GetMapping
    public List<Grievance> getAllGrievances() {
        return grievanceRepository.findAll();
    }

    // SEARCH BY TICKET ID
    @GetMapping("/{ticketId}")
    public Grievance getGrievanceByTicket(@PathVariable String ticketId) {
        return grievanceRepository.findByTicketId(ticketId);
    }

    // GET EMPLOYEE GRIEVANCES
    @GetMapping("/employee/{email}")
    public List<Grievance> getEmployeeGrievances(@PathVariable String email) {
        return grievanceRepository.findByEmployeeEmail(email);
    }

    // UPDATE STATUS (ADMIN)
    @PutMapping("/update-status/{id}")
    public Grievance updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String resolutionNote,
            @RequestParam(required = false) String changedBy,
            HttpServletRequest request) {

        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grievance not found"));

        String oldStatus = grievance.getStatus();
        grievance.setStatus(status);

        if ("Resolved".equals(status) && resolutionNote != null) {
            grievance.setResolutionNote(resolutionNote);
            grievance.setResolvedAt(LocalDateTime.now());
        }

        Grievance updated = grievanceRepository.save(grievance);

        GrievanceHistory history = new GrievanceHistory();
        history.setTicketId(updated.getTicketId());
        history.setStatus(status);
        history.setChangedBy(changedBy != null ? changedBy : "Admin");
        history.setComment(
            "Resolved".equals(status) && resolutionNote != null
                ? "Resolved: " + resolutionNote
                : "Status updated to " + status
        );
        historyRepository.save(history);

        String adminEmail = changedBy != null ? changedBy : "Admin";
        String action = "Resolved".equals(status) ? "RESOLVED_GRIEVANCE"
                      : "Rejected".equals(status) ? "REJECTED_GRIEVANCE"
                      : "STATUS_CHANGED";

        auditLogService.log(
            adminEmail,
            action,
            "Grievance",
            updated.getTicketId(),
            "Status changed from " + oldStatus + " to " + status,
            request.getRemoteAddr()
        );

        return updated;
    }

    // GET TIMELINE HISTORY
    @GetMapping("/history/{ticketId}")
    public List<GrievanceHistory> getHistory(@PathVariable String ticketId) {
        return historyRepository.findByTicketIdOrderByUpdatedAtAsc(ticketId);
    }
}