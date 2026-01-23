package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {

        String prompt = buildStrictPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        try {
            String response = webClient.post()
                    .uri(geminiApiUrl)
                    .header("x-goog-api-key", geminiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return extractResponseContent(response);

        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating email: " + e.getMessage();
        }
    }

    // 🔒 STRICT PROMPT (NO EXTRA AI TALK)
    private String buildStrictPrompt(EmailRequest emailRequest) {

        String tone = (emailRequest.getTone() != null && !emailRequest.getTone().isBlank())
                ? emailRequest.getTone()
                : "neutral";

        return
                "Rewrite the following email in a " + tone + " tone.\n" +
                        "IMPORTANT RULES:\n" +
                        "1. Return ONLY the rewritten email content.\n" +
                        "2. Do NOT add explanations, headings, or options.\n" +
                        "3. Do NOT say phrases like 'Here are some options'.\n" +
                        "4. Output must be plain email text only.\n\n" +
                        "Email Content:\n" +
                        emailRequest.getEmailContent();
    }

    private String extractResponseContent(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);

            return rootNode
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText()
                    .trim();

        } catch (Exception e) {
            return "Error parsing AI response: " + e.getMessage();
        }
    }
}
