package com.fitness.activityservice.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@Slf4j
public class UserValidationServiceImpl {
    @Autowired
    private WebClient webClient;

    public boolean validateUser(String userId){
        log.info("Calling User Validation Api for userId:{}",userId);
       try{
           return Boolean.TRUE.equals(webClient
                   .get()
                   .uri("/api/users/{userId}/validate", userId)
                   .retrieve()
                   .bodyToMono(Boolean.class)
                   .block());
       }
       catch (WebClientResponseException e){
           if(e.getStatusCode()== HttpStatus.NOT_FOUND){
               throw new RuntimeException("User Not Found:" + userId);
           } else if(e.getStatusCode()== HttpStatus.BAD_REQUEST){
               throw new RuntimeException("Invalid Request" + userId);
           }
       }
        return false;
    }

}
