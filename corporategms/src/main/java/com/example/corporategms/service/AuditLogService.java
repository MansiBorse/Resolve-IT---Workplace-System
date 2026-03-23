package com.example.corporategms.service;

import com.example.corporategms.entity.AuditLog;
import com.example.corporategms.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String adminEmail, String action, String entityName,
                    String entityId, String details, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setAdminEmail(adminEmail);
        log.setAction(action);
        log.setEntityName(entityName);
        log.setEntityId(entityId);
        log.setDetails(details);
        log.setIpAddress(ipAddress);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}