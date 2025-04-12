package com.akhil.aiservice.service.impl;

import com.akhil.aiservice.dto.Activity;
import com.akhil.aiservice.model.Recommendation;
import com.akhil.aiservice.service.ActivityAIService;
import com.akhil.aiservice.service.GeminiService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;


@Service
@Slf4j
public class ActivityAiServiceImpl implements ActivityAIService {
    @Autowired
    private GeminiService geminiService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public Recommendation generateRecommendation(Activity activity) {
        String prompt=createPromptForActivity(activity);
        String aiResponse=geminiService.getAnswer(prompt);
        log.info("Response From Ai:{}",aiResponse);
        Recommendation recommendation=processAiResponse(activity,aiResponse);
        return recommendation;
    }

    private Recommendation processAiResponse(Activity activity,String aiResponse){
        try {
            ObjectMapper mapper=new ObjectMapper();
            JsonNode rootNode=mapper.readTree(aiResponse);
            JsonNode textNode=rootNode.path("candidates").get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");
            String jsonContent= textNode.asText().replaceAll("```json\\n","")
                    .replaceAll("\\n```","")
                    .trim();
            //log.info("Parsed Response From Ai:{}",jsonContent);
            JsonNode analysisJson=mapper.readTree(jsonContent);
            JsonNode analysisNode=analysisJson.path("analysis");
            StringBuilder fullAnalysis=new StringBuilder();
            addAnalysisSection(fullAnalysis,analysisNode,"overall","Overall:");
            addAnalysisSection(fullAnalysis,analysisNode,"pace","Pace:");
            addAnalysisSection(fullAnalysis,analysisNode,"heartRate","Heart Rate:");
            addAnalysisSection(fullAnalysis,analysisNode,"caloriesBurned","Calories:");
            List<String> improvements=extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions=extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety=extractSafetyGuideLines(analysisJson.path("safety"));
            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    //.createdAt(LocalDateTime.now())
                    .build();
        } catch (Exception e){
            e.printStackTrace();
            return  createDefaultRecommendation(activity);
        }


    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                //.createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuideLines(JsonNode safetyNode) {
        List<String> safety=new ArrayList<>();
        if(safetyNode.isArray()){
            safetyNode.forEach(item->{
                safety.add(item.asText());
            });
        }
        return safety.isEmpty()? Collections.singletonList("Follow general safety guidelines"):
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions=new ArrayList<>();
        if(suggestionsNode.isArray()){
            suggestionsNode.forEach(suggestion->{
                String area=suggestion.path("workout").asText();
                String detail=suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s",area,detail));
            });
        }
        return suggestions.isEmpty()? Collections.singletonList("No specific suggestion provided"):
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements=new ArrayList<>();
        if(improvementsNode.isArray()){
            improvementsNode.forEach(improvement->{
                String area=improvement.path("area").asText();
                String detail=improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s",area,detail));
            });
        }
        return improvements.isEmpty()? Collections.singletonList("No specific improvements provided"):
                improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()){
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }

    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
            Analyze the following fitness activity and provide a detailed recommendation 
            in the EXACT JSON format shown below:

            {
              "analysis": {
                "overall": "Overall analysis here",
                "pace": "Pace analysis here",
                "heartRate": "Heart rate analysis here",
                "caloriesBurned": "Calories analysis here"
              },
              "improvements": [
                {
                  "area": "Area name",
                  "recommendation": "Detailed recommendation"
                }
              ],
              "suggestions": [
                {
                  "workout": "Workout name",
                  "description": "Detailed workout description"
                }
              ],
              "safety": [
                "Safety point 1",
                "Safety point 2"
              ]
            }

            Activity Details:
            - Activity Type: %s
            - Duration: %d minutes
            - Calories Burned: %d
            - Additional Metrics: %s

            Focus on: performance analysis, areas for improvement, next workout suggestions, 
            and safety guidelines.

            Important: Follow the EXACT JSON format provided above.
            """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );
    }

}


//"analysis": {
//        "overall": "The 60-minute run covering 5.2 miles at an average speed of 10.4 km/h indicates a moderate intensity workout.  Burning 600 calories in this timeframe is reasonable for someone of average fitness level,  but further data (weight, age, gender) is needed for a more precise evaluation.",
//        "pace": "A 10.4 km/h average pace is a good pace for a moderately experienced runner.  Maintaining this pace for a full hour demonstrates decent endurance. However, incorporating varied paces in future runs could enhance performance.",
//        "heartRate": "A maximum heart rate of 165 bpm suggests exertion within a moderate to high intensity range.  Knowing the resting heart rate and average heart rate during the run would provide a more comprehensive picture of cardiovascular response.",
//        "caloriesBurned": "Burning 600 calories in 60 minutes is a decent calorie expenditure for this activity. However, calorie burn is highly individual and depends on factors like weight, metabolism, and intensity.  It's advisable to use a more accurate calorie tracking method specific to the individual."
//        },
//        "improvements": [
//        {
//        "area": "Endurance",
//        "recommendation": "Gradually increase the duration of your runs over time.  Start with small increments (e.g., 5-10 minutes per week) to avoid injury.  Focus on maintaining a consistent pace throughout the run."
//        },
//        {
//        "area": "Speed",
//        "recommendation": "Incorporate interval training into your routine. This involves alternating between high-intensity bursts and periods of rest or lower intensity running.  This will improve your speed and overall fitness level."
//        },
//        {
//        "area": "Heart Rate Monitoring",
//        "recommendation": "Use a heart rate monitor to track your heart rate during workouts. This helps you monitor intensity levels and ensure you're training within your target heart rate zones. This allows for better workout planning and performance optimization."
//        }
//        ],
//        "suggestions": [
//        {
//        "workout": "Interval Training",
//        "description": "Warm-up for 10 minutes. Then alternate between 4 minutes of running at a faster than usual pace (80-90% of your max heart rate) and 2 minutes of jogging or walking (recovery). Repeat this cycle 4-6 times. Cool down for 10 minutes."
//        },
//        {
//        "workout": "Long Slow Distance (LSD) Run",
//        "description": "Run at a comfortable pace for a longer duration than usual, focusing on maintaining a consistent effort without pushing yourself too hard.  Gradually increase the distance over time. This improves your endurance."
//        }
//        ],
//        "safety": [
//        "Always warm up before running and cool down afterwards to prevent injury.",
//        "Listen to your body and stop if you experience any pain. Don't push yourself beyond your limits, especially when starting a new exercise routine.",
//        "Stay hydrated by drinking plenty of water before, during, and after your run.",
//        "Run in well-lit and safe areas, especially at night.",
//        "Wear appropriate running shoes and clothing."
//        ]
//        }
