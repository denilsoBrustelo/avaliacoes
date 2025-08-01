package com.sistema.avaliacoes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SistemaAvaliacoesApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaAvaliacoesApplication.class, args);
    }
}
