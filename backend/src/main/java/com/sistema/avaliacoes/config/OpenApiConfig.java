package com.sistema.avaliacoes.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Sistema de Avaliações Educacionais - API",
        description = "API completa para gerenciamento de avaliações educacionais com suporte a questões, usuários, avaliações e correções automatizadas.",
        version = "1.0.0",
        contact = @Contact(
            name = "Sistema de Avaliações",
            email = "contato@sistema-avaliacoes.com"
        ),
        license = @License(
            name = "MIT License",
            url = "https://opensource.org/licenses/MIT"
        )
    ),
    servers = {
        @Server(
            description = "Local Development Server",
            url = "http://localhost:8080/api"
        )
    }
)
@SecurityScheme(
    name = "Bearer Authentication",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    scheme = "bearer",
    description = "Digite o token JWT obtido através do endpoint de login. Exemplo: Bearer eyJhbGciOiJIUzI1NiJ9..."
)
public class OpenApiConfig {
    // Esta classe configura a documentação OpenAPI/Swagger com autenticação JWT
    // As anotações acima definem:
    // 1. Informações da API (título, descrição, versão, contato, licença)
    // 2. Servidor local para testes
    // 3. Esquema de segurança JWT Bearer Token
}
