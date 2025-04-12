package com.akhil.aiservice.service.impl;

import com.akhil.aiservice.dto.Activity;
import com.akhil.aiservice.model.Recommendation;
import com.akhil.aiservice.repo.RecommendationRepo;
import com.akhil.aiservice.service.ActivityAIService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ActivityMessageListener {
    @Autowired
    private ActivityAIService activityAIService;
    @Autowired
    private RecommendationRepo recommendationRepo;
    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity){
        log.info("Received activity for processing :{} ",activity.getId());
        //log.info("Generated Recommendation  :{} ", activityAIService.generateRecommendation(activity));
        Recommendation recommendation=activityAIService.generateRecommendation(activity);
        recommendationRepo.save(recommendation);
    }
}
