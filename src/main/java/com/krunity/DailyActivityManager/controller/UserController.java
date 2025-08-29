package com.krunity.DailyActivityManager.controller;

import com.krunity.DailyActivityManager.entity.User;
import com.krunity.DailyActivityManager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> optionalUser = userService.findByEmail(loginRequest.getEmail());

        ResponseEntity<?> response;

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            boolean passwordMatch = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());

            if (passwordMatch) {
                response = ResponseEntity.ok(user);
            } else {
                response = ResponseEntity.status(401).body("Invalid credentials");
            }
        } else {
            response = ResponseEntity.status(401).body("Invalid credentials");
        }

        return response;
    }

}
