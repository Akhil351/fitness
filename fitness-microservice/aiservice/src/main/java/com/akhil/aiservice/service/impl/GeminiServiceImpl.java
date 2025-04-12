package com.akhil.aiservice.service.impl;

import com.akhil.aiservice.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiServiceImpl implements GeminiService {
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    @Autowired
    private WebClient webClient;

    @Override
    public String getAnswer(String question) {
        Map<String,Object> requestBody=new HashMap<>();
        requestBody.put("contents", List.of(
                Map.of("parts", List.of(Map.of("text", question)))
        ));
        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey)  // Set API URL
                .bodyValue(requestBody)            // Set request body
                .retrieve()                         // Send request & get response
                .bodyToMono(String.class)           // Convert response body to Mono<String>
                .block();
        return response;
    }
}
