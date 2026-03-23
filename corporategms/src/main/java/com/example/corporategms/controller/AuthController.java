package com.example.corporategms.controller;

import com.example.corporategms.entity.User;
import com.example.corporategms.repository.UserRepository;
import com.example.corporategms.security.JwtUtil;
import com.example.corporategms.service.AuditLogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuditLogService auditLogService;

    private static Map<String, String> otpStorage = new HashMap<>();
    private static Map<String, Long> otpExpiry = new HashMap<>();


    // REGISTER
    @PostMapping("/register")
    public String register(@RequestBody User user, HttpServletRequest request) {

        if (user.getEmployeeId() == null || user.getEmployeeId().trim().isEmpty())
            return "Employee ID is required";
        if (user.getName() == null || user.getName().trim().isEmpty())
            return "Name is required";
        if (user.getEmail() == null || user.getEmail().trim().isEmpty())
            return "Email is required";
        if (user.getPassword() == null || user.getPassword().length() < 6)
            return "Password must be at least 6 characters";
        if (userRepository.existsByEmployeeId(user.getEmployeeId()))
            return "Employee ID already exists";
        if (userRepository.existsByEmail(user.getEmail()))
            return "Email already registered";

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        // AUDIT LOG
        auditLogService.log(
            user.getEmail(),
            "CREATED_USER",
            "User",
            user.getEmployeeId(),
            "New user registered: " + user.getName(),
            request.getRemoteAddr()
        );

        return "Registration Successful";
    }


    // LOGIN
    @PostMapping("/login")
    public Object login(@RequestBody User user, HttpServletRequest request) {

        if (user.getEmail() == null || user.getEmail().trim().isEmpty())
            return "Email is required";
        if (user.getPassword() == null || user.getPassword().isEmpty())
            return "Password is required";

        User existingUser = userRepository.findByEmail(user.getEmail().trim());

        if (existingUser == null)
            return "User not found";
        if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword()))
            return "Invalid Password";

        String token = jwtUtil.generateToken(existingUser.getEmail());

        // AUDIT LOG
        auditLogService.log(
            existingUser.getEmail(),
            "LOGIN",
            "Auth",
            existingUser.getEmployeeId(),
            "User logged in: " + existingUser.getName(),
            request.getRemoteAddr()
        );

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        // ✅ FIX: return name so frontend can show "Welcome, Mansi"
        response.put("name", existingUser.getName());
        return response;
    }


    // SEND OTP
    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody Map<String, String> request,
                          HttpServletRequest httpRequest) {

        String email = request.get("email").trim();

        System.out.println("=== SEND OTP ===");
        System.out.println("Email received: [" + email + "]");

        User user = userRepository.findByEmail(email);

        if (user == null)
            return "Email not registered";

        int otp = new Random().nextInt(900000) + 100000;
        otpStorage.put(email, String.valueOf(otp));
        otpExpiry.put(email, System.currentTimeMillis() + 5 * 60 * 1000);

        System.out.println("OTP generated: [" + otp + "]");
        System.out.println("Stored for email: [" + email + "]");
        System.out.println("otpStorage: " + otpStorage);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("mansiborse21@gmail.com");
            message.setTo(email);
            message.setSubject("ResolveIT Password Reset OTP");
            message.setText(
                "Hello,\n\n" +
                "Your OTP for password reset is: " + otp +
                "\n\nThis OTP is valid for 5 minutes." +
                "\n\nResolveIT Team"
            );
            mailSender.send(message);

            // AUDIT LOG
            auditLogService.log(
                email,
                "SEND_OTP",
                "Auth",
                email,
                "Password reset OTP sent to: " + email,
                httpRequest.getRemoteAddr()
            );

            return "OTP sent successfully";

        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to send OTP";
        }
    }


    // RESET PASSWORD
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody Map<String, String> request,
                                HttpServletRequest httpRequest) {

        String email = request.get("email").trim();
        String otp = request.get("otp").trim();
        String password = request.get("password");

        System.out.println("=== RESET PASSWORD ===");
        System.out.println("Email received: [" + email + "]");
        System.out.println("OTP received: [" + otp + "]");
        System.out.println("otpStorage at reset: " + otpStorage);
        System.out.println("Stored OTP for email: [" + otpStorage.get(email) + "]");

        Long expiry = otpExpiry.get(email);

        if (expiry == null || System.currentTimeMillis() > expiry) {
            System.out.println("OTP expired or not found");
            otpStorage.remove(email);
            otpExpiry.remove(email);
            return "OTP has expired. Please request a new one.";
        }

        String storedOtp = otpStorage.get(email);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            System.out.println("OTP mismatch! Stored: [" + storedOtp + "] Entered: [" + otp + "]");
            return "Invalid OTP";
        }

        User user = userRepository.findByEmail(email);

        if (user == null)
            return "User not found";
        if (password == null || password.length() < 6)
            return "Password must be at least 6 characters";

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

        otpStorage.remove(email);
        otpExpiry.remove(email);

        // AUDIT LOG
        auditLogService.log(
            email,
            "RESET_PASSWORD",
            "Auth",
            email,
            "Password reset successfully for: " + email,
            httpRequest.getRemoteAddr()
        );

        System.out.println("Password reset successful for: [" + email + "]");
        return "Password updated successfully";
    }
}