package com.krunity.DailyActivityManager.service;

import com.krunity.DailyActivityManager.dto.ActivityDTO;
import com.krunity.DailyActivityManager.entity.Activity;
import com.krunity.DailyActivityManager.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepository activityRepository;

    public Activity addActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    public List<ActivityDTO> getUserActivities(Long userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(a -> {
                    ActivityDTO dto = new ActivityDTO();
                    dto.setId(a.getId());
                    dto.setActivityName(a.getActivityName());
                    dto.setUserId(a.getUser().getId());
                    return dto;
                })
                .toList();
    }

}
