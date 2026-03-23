package com.example.corporategms.scheduler;

import com.example.corporategms.entity.Grievance;
import com.example.corporategms.entity.GrievanceHistory;
import com.example.corporategms.repository.GrievanceRepository;
import com.example.corporategms.repository.GrievanceHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class EscalationScheduler {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private GrievanceHistoryRepository historyRepository;

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void escalateOldGrievances() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

        List<Grievance> oldGrievances = grievanceRepository
            .findByStatusAndCreatedAtBefore("Pending", sevenDaysAgo);

        for (Grievance g : oldGrievances) {
            g.setStatus("Escalated");
            grievanceRepository.save(g);

            // Add to history
            GrievanceHistory history = new GrievanceHistory();
            history.setTicketId(g.getTicketId());
            history.setStatus("Escalated");
            history.setChangedBy("System");
            history.setComment("Auto-escalated: Not resolved within 7 days");
            historyRepository.save(history);

            System.out.println("Escalated: " + g.getTicketId());
        }

        System.out.println("Escalation check done. Total escalated: " + oldGrievances.size());
    }
}