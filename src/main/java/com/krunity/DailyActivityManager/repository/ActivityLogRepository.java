package com.krunity.DailyActivityManager.repository;

import com.krunity.DailyActivityManager.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUserIdAndDate(Long userId, LocalDate date);
    List<ActivityLog> findByUserId(Long userId);
}

