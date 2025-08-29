package com.krunity.DailyActivityManager.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ActivityDTO {
    private Long id;
    private String activityName;
    private Long userId;
}
