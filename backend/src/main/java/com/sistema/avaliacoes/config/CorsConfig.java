package com.sistema.avaliacoes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir origens do frontend (mais permissivo para desenvolvimento)
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:*",
            "http://127.0.0.1:*",
            "https://localhost:*",
            "https://*.fly.dev"
        ));
        
        // Permitir todos os métodos HTTP
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        
        // Permitir todos os cabeçalhos
        configuration.setAllowedHeaders(Arrays.asList(
            "authorization", "content-type", "x-auth-token", "cache-control", "x-requested-with"
        ));
        
        // Permitir credenciais
        configuration.setAllowCredentials(true);
        
        // Configurar tempo de cache do preflight
        configuration.setMaxAge(3600L);
        
        // Aplicar configuração a todas as rotas
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
