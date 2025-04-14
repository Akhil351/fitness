package com.fitness.userservice.service.impl;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repo.UserRepo;
import com.fitness.userservice.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepo userRepo;
    @Override
    public UserResponse register(RegisterRequest request) {
        if(userRepo.existsByEmail(request.getEmail())){
            User existingUser=userRepo.findByEmail(request.getEmail());
            return UserResponse.builder()
                    .id(existingUser.getId())
                    .keyCloakId(existingUser.getKeyCloakId())
                    .password(existingUser.getPassword())
                    .email(existingUser.getEmail())
                    .firstName(existingUser.getFirstName())
                    .lastName(existingUser.getLastName())
                    .createdAt(existingUser.getCreatedAt())
                    .updateAt(existingUser.getUpdateAt())
                    .build();
        }
        User user=User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .keyCloakId(request.getKeyCloakId())
                .build();
        User savedUser=userRepo.save(user);
        return UserResponse.builder()
                .id(savedUser.getId())
                .keyCloakId(savedUser.getKeyCloakId())
                .password(savedUser.getPassword())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .createdAt(savedUser.getCreatedAt())
                .updateAt(savedUser.getUpdateAt())
                .build();
    }

    @Override
    public UserResponse getUserProfile(String userId) {
        User user=userRepo.findById(userId).orElseThrow(()->
                new RuntimeException("User not found"));
        return UserResponse.builder()
                .id(user.getId())
                .password(user.getPassword())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .createdAt(user.getCreatedAt())
                .updateAt(user.getUpdateAt())
                .build();
    }

    @Override
    public Boolean existByUserId(String userId) {
        log.info("Calling User Validation Api for userId:{}",userId);
        return userRepo.existsByKeyCloakId(userId);
    }
}
