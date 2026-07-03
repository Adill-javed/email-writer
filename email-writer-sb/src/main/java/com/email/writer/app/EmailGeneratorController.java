package com.email.writer.app;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins="*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailService;

    public EmailGeneratorController(EmailGeneratorService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest request) {
        String result = emailService.generateEmailReply(request);
        return ResponseEntity.ok(result);
    }
}

