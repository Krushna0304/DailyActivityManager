package com.krunity.DailyActivityManager.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.krunity.DailyActivityManager.dto.ActivityLogDTO;
import com.krunity.DailyActivityManager.entity.Activity;
import com.krunity.DailyActivityManager.entity.ActivityLog;
import com.krunity.DailyActivityManager.entity.User;
import com.krunity.DailyActivityManager.repository.ActivityRepository;
import com.krunity.DailyActivityManager.repository.UserRepository;
import com.krunity.DailyActivityManager.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class ActivityLogController {
    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityRepository activityRepository;


    @GetMapping("/check")
    public String check() {
        return "ActivityLogController is working!";
    }

    @PostMapping
    public ResponseEntity<ActivityLogDTO> addLog(@RequestBody ActivityLogDTO logDTO) {
        System.out.println("Add Log Called");
        try {
            ActivityLog log = new ActivityLog();

            // Set user
            User user = userRepository.findById(logDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            log.setUser(user);

            // Set activity
            Activity activity = activityRepository.findById(logDTO.getActivityId())
                    .orElseThrow(() -> new RuntimeException("Activity not found"));
            log.setActivity(activity);

            // Set other fields
            log.setDate(logDTO.getDate());
            log.setDuration(logDTO.getDuration());
            log.setNotes(logDTO.getNotes());

            // Save log
            ActivityLog savedLog = activityLogService.addLog(log);

            // Build response DTO (prevents recursion issues)
            ActivityLogDTO responseDTO = new ActivityLogDTO();
            responseDTO.setUserId(savedLog.getUser().getId());
            responseDTO.setActivityId(savedLog.getActivity().getId());
            responseDTO.setDate(savedLog.getDate());
            responseDTO.setDuration(savedLog.getDuration());
            responseDTO.setNotes(savedLog.getNotes());

            return ResponseEntity.ok(responseDTO);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping
    public ResponseEntity<List<ActivityLogDTO>> getLogsForDay(@RequestParam Long userId,
                                                              @RequestParam String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<ActivityLogDTO> logs = activityLogService.getLogsForDay(userId, localDate);
        return ResponseEntity.ok(logs);
    }


    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestParam Long userId, @RequestParam String range) {
        // This is a placeholder. You should implement logic in ActivityLogService to calculate summaries and streaks.
        // Example response structure:
        // { "summary": { "activityName": totalMinutes, ... }, "streaks": { "activityName": streakDays, ... } }
        System.out.println("Ok Bhaiya");
        return ResponseEntity.ok(activityLogService.getSummary(userId, range));
    }
}
