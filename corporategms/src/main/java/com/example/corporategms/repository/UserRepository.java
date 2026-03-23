package com.example.corporategms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.corporategms.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {


User findByEmail(String email);

boolean existsByEmployeeId(String employeeId);

boolean existsByEmail(String email);


}
