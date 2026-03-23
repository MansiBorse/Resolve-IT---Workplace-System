package com.example.corporategms.controller;

import com.example.corporategms.entity.AuditLog;
import com.example.corporategms.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/audit-logs")
@CrossOrigin(origins = "http://localhost:5173")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }
}