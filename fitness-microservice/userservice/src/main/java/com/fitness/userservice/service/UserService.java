package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import jakarta.validation.Valid;

public interface UserService {

    UserResponse register(@Valid RegisterRequest request);

    UserResponse getUserProfile(String userId);

    Boolean existByUserId(String userId);
}
