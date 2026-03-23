package com.example.corporategms.repository;
import java.time.LocalDateTime; 
import java.util.List;
import com.example.corporategms.entity.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrievanceRepository extends JpaRepository<Grievance, Long> {

    Grievance findByTicketId(String ticketId);
    List<Grievance> findByStatusAndCreatedAtBefore(String status, LocalDateTime date); // ADD THIS
    List<Grievance> findByEmployeeEmail(String employeeEmail);

}
   