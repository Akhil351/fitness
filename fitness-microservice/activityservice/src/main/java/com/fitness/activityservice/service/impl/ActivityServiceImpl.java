package com.fitness.activityservice.service.impl;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.repo.ActivityRepo;
import com.fitness.activityservice.service.ActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ActivityServiceImpl implements ActivityService {
    @Autowired
    private ActivityRepo activityRepo;
    @Autowired
    private UserValidationServiceImpl userValidationService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;
    @Value("${rabbitmq.routing.key}")
    private String routingKey;
    @Override
    public ActivityResponse trackActivity(ActivityRequest request) {
        boolean isValidUser=userValidationService.validateUser(request.getUserId());
        if(!isValidUser){
            throw new RuntimeException("Invalid User: "+request.getUserId());
        }
        Activity activity=Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();
        Activity savedActivity=activityRepo.save(activity);
        // Publish to RabbitMq for Ai Processing
        try{
            rabbitTemplate.convertAndSend(exchange,routingKey,savedActivity);
        }
        catch (Exception e){
            log.error("Failed to publish activity ti RabbitMQ ",e);
        }
        return activityToActivityResponse(savedActivity);
    }

    @Override
    public List<ActivityResponse> getUserActivity(String userId) {
        List<Activity> activities=activityRepo.findByUserId(userId);
        return activities.stream().map(this::activityToActivityResponse).toList();
    }

    @Override
    public ActivityResponse getActivity(String activityId) {
        return activityToActivityResponse(activityRepo.findById(activityId).orElseThrow(()->new RuntimeException("activity not found")));
    }

    private ActivityResponse activityToActivityResponse(Activity activity){
        return ActivityResponse.builder()
                .id(activity.getId())
                .userId(activity.getUserId())
                .type(activity.getType())
                .duration(activity.getDuration())
                .caloriesBurned(activity.getCaloriesBurned())
                .startTime(activity.getStartTime())
                .additionalMetrics(activity.getAdditionalMetrics())
                .createdAt(activity.getCreatedAt())
                .updatedAt(activity.getUpdatedAt())
                .build();
    }
}
