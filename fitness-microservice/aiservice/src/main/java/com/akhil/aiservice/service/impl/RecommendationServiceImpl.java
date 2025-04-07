package com.akhil.aiservice.service.impl;

import com.akhil.aiservice.model.Recommendation;
import com.akhil.aiservice.repo.RecommendationRepo;
import com.akhil.aiservice.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationServiceImpl implements RecommendationService {
    @Autowired
    private RecommendationRepo recommendationRepo;

    @Override
    public List<Recommendation> getUserRecommendation(String userId) {
        return recommendationRepo.findByUserId(userId);
    }

    @Override
    public Recommendation getActivityRecommendation(String activityId) {
        return recommendationRepo.findByActivityId(activityId)
                .orElseThrow(()->new RuntimeException("No recommendation Found for this activity:"+activityId));
    }
}
