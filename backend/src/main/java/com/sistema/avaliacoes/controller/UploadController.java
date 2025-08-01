package com.sistema.avaliacoes.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
@Tag(name = "Upload", description = "Operações de upload de arquivos e imagens")
@CrossOrigin(origins = "http://localhost:3000")
public class UploadController {

    private static final String UPLOAD_DIR = "uploads/";
    private static final String IMAGES_DIR = UPLOAD_DIR + "images/";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @PostMapping("/image")
    @Operation(summary = "Upload de imagem", description = "Faz upload de uma imagem para questões ou alternativas")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            return handleFileUpload(file, IMAGES_DIR, "image");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao fazer upload da imagem: " + e.getMessage()));
        }
    }

    @PostMapping("/document")
    @Operation(summary = "Upload de documento", description = "Faz upload de um documento")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Map<String, String>> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            return handleFileUpload(file, UPLOAD_DIR + "documents/", "document");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao fazer upload do documento: " + e.getMessage()));
        }
    }

    @DeleteMapping("/file")
    @Operation(summary = "Excluir arquivo", description = "Remove um arquivo do servidor")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Map<String, String>> deleteFile(@RequestParam("filename") String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return ResponseEntity.ok(Map.of("message", "Arquivo excluído com sucesso"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao excluir arquivo: " + e.getMessage()));
        }
    }

    @GetMapping("/info/{filename}")
    @Operation(summary = "Informações do arquivo", description = "Obtém informações sobre um arquivo")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROFESSOR')")
    public ResponseEntity<Map<String, Object>> getFileInfo(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename);
            
            if (Files.exists(filePath)) {
                Map<String, Object> info = new HashMap<>();
                info.put("filename", filename);
                info.put("size", Files.size(filePath));
                info.put("lastModified", Files.getLastModifiedTime(filePath).toString());
                info.put("contentType", Files.probeContentType(filePath));
                
                return ResponseEntity.ok(info);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao obter informações do arquivo: " + e.getMessage()));
        }
    }

    private ResponseEntity<Map<String, String>> handleFileUpload(MultipartFile file, String directory, String type) throws IOException {
        // Validações básicas
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Arquivo não pode estar vazio"));
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Arquivo muito grande. Tamanho máximo: 5MB"));
        }

        // Validar tipo de arquivo para imagens
        if ("image".equals(type)) {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Apenas arquivos de imagem são permitidos"));
            }
        }

        // Criar diretório se não existir
        Path uploadPath = Paths.get(directory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Gerar nome único para o arquivo
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        // Salvar arquivo
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Retornar informações do arquivo
        Map<String, String> response = new HashMap<>();
        response.put("filename", uniqueFilename);
        response.put("originalName", originalFilename);
        response.put("path", directory + uniqueFilename);
        response.put("size", String.valueOf(file.getSize()));
        response.put("contentType", file.getContentType());
        response.put("url", "/api/files/" + uniqueFilename);

        return ResponseEntity.ok(response);
    }
}
