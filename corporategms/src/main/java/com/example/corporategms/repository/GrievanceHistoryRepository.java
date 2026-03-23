package com.example.corporategms.repository;

import com.example.corporategms.entity.GrievanceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GrievanceHistoryRepository extends JpaRepository<GrievanceHistory, Long> {

    List<GrievanceHistory> findByTicketIdOrderByUpdatedAtAsc(String ticketId);

}