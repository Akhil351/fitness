package com.akhil.gateway.user;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class UserService {
    @Autowired
    private WebClient webClient;

    public Mono<Boolean> validateUser(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);

        return webClient
                .get()
                .uri("/api/users/{userId}/validate", userId)
                .retrieve()
                .bodyToMono(Boolean.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                        return Mono.error(new RuntimeException("User Not Found: " + userId));
                    } else if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        return Mono.error(new RuntimeException("Invalid Request: " + userId));
                    } else {
                        return Mono.error(e);
                    }
                });
    }


    public Mono<UserResponse> registerUser(RegisterRequest registerRequest) {
        log.info("Calling User Registration API for email: {}", registerRequest.getEmail());
        return webClient
                .post()
                .uri("/api/users/register")
                .bodyValue(registerRequest)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode() == HttpStatus.BAD_REQUEST) {
                        return Mono.error(new RuntimeException("Bad Request: " + e.getMessage()));
                    } else if (e.getStatusCode() == HttpStatus.INTERNAL_SERVER_ERROR) {
                        return Mono.error(new RuntimeException(" Internal Server Error " + e.getMessage()));
                    } else {
                        return Mono.error(e);
                    }
                });
    }
}
