package com.krunity.DailyActivityManager.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class ActivityLogDTO {
    private Long userId;
    private Long activityId;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private int duration;
    private String notes;
}
