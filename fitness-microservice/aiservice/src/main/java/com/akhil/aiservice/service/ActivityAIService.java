package com.akhil.aiservice.service;

import com.akhil.aiservice.dto.Activity;
import com.akhil.aiservice.model.Recommendation;

public interface ActivityAIService {
    Recommendation generateRecommendation(Activity activity);
}
