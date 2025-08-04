package com.sistema.avaliacoes.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@Tag(name = "Health", description = "Endpoints de verificação de saúde da API")
@CrossOrigin(origins = "http://localhost:3000")
public class HealthController {

    @GetMapping
    @Operation(summary = "Verificação básica da API")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Sistema de Avaliações - Backend");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    @Operation(summary = "Verificação detalhada de saúde")
    public ResponseEntity<Map<String, Object>> detailedHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Sistema de Avaliações");
        response.put("timestamp", LocalDateTime.now());
        response.put("environment", "development");
        response.put("database", "H2 In-Memory");
        response.put("swagger_ui", "/swagger-ui.html");
        response.put("h2_console", "/h2-console");
        response.put("api_docs", "/v3/api-docs");
        return ResponseEntity.ok(response);
    }
}
