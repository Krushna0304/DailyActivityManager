package com.krunity.DailyActivityManager.controller;

import com.krunity.DailyActivityManager.dto.ActivityDTO;
import com.krunity.DailyActivityManager.entity.Activity;
import com.krunity.DailyActivityManager.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    @Autowired
    private ActivityService activityService;

    @PostMapping
    public ResponseEntity<Activity> addActivity(@RequestBody Activity activity) {
        Activity savedActivity = activityService.addActivity(activity);
        return ResponseEntity.ok(savedActivity);
    }

    @GetMapping
    public ResponseEntity<List<ActivityDTO>> getUserActivities(@RequestParam Long userId) {
        List<ActivityDTO> activities = activityService.getUserActivities(userId);
        return ResponseEntity.ok(activities);
    }
}

