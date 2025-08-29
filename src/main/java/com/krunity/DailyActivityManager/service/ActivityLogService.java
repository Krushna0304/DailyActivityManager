package com.krunity.DailyActivityManager.service;

import com.krunity.DailyActivityManager.dto.ActivityLogDTO;
import com.krunity.DailyActivityManager.entity.ActivityLog;
import com.krunity.DailyActivityManager.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ActivityLogService {
    @Autowired
    private ActivityLogRepository activityLogRepository;

    public ActivityLog addLog(ActivityLog log) {
        return activityLogRepository.save(log);
    }

    public List<ActivityLogDTO> getLogsForDay(Long userId, LocalDate date) {
        List<ActivityLog> logs = activityLogRepository.findByUserIdAndDate(userId, date);

        return logs.stream().map(log -> {
            ActivityLogDTO dto = new ActivityLogDTO();
            dto.setUserId(log.getUser().getId());
            dto.setActivityId(log.getActivity().getId());
            dto.setDate(log.getDate());
            dto.setDuration(log.getDuration());
            dto.setNotes(log.getNotes());
            return dto;
        }).toList();
    }


    public List<ActivityLog> getLogsForUser(Long userId) {
        return activityLogRepository.findByUserId(userId);
    }

    public Object getSummary(Long userId, String range) {
        List<ActivityLog> logs = getLogsForUser(userId);
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        switch (range.toLowerCase()) {
            case "daily":
                startDate = today;
                break;
            case "weekly":
                startDate = today.minusDays(6);
                break;
            case "monthly":
                startDate = today.withDayOfMonth(1);
                break;
            default:
                startDate = today;
        }
        // Filter logs by date range
        List<ActivityLog> filteredLogs = logs.stream()
            .filter(log -> !log.getDate().isBefore(startDate) && !log.getDate().isAfter(today))
            .toList();
        // Aggregate total time per activity
        java.util.Map<String, Integer> summary = new java.util.HashMap<>();
        for (ActivityLog log : filteredLogs) {
            String activityName = log.getActivity().getActivityName();
            summary.put(activityName, summary.getOrDefault(activityName, 0) + log.getDuration());
        }
        // Calculate streaks per activity
        java.util.Map<String, Integer> streaks = new java.util.HashMap<>();
        for (ActivityLog log : logs) {
            String activityName = log.getActivity().getActivityName();
            streaks.put(activityName, Math.max(streaks.getOrDefault(activityName, 0), calculateStreak(userId, log.getActivity().getId())));
        }
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("summary", summary);
        result.put("streaks", streaks);
        return result;
    }

    private int calculateStreak(Long userId, Long activityId) {
        List<ActivityLog> logs = activityLogRepository.findByUserId(userId);
        logs = logs.stream().filter(l -> l.getActivity().getId().equals(activityId)).toList();
        logs = new java.util.ArrayList<>(logs); // Make the list mutable
        logs.sort(java.util.Comparator.comparing(ActivityLog::getDate).reversed());
        int streak = 0;
        LocalDate current = LocalDate.now();
        for (ActivityLog log : logs) {
            if (log.getDate().equals(current.minusDays(streak))) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
}
