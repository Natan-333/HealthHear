package br.com.fiap.health.hear.controller;
import br.com.fiap.health.hear.dto.LoginDTO;
import br.com.fiap.health.hear.model.Usuario;
import br.com.fiap.health.hear.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/login")
public class LoginController {

    private final UsuarioService usuarioService;

    public LoginController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<?> autenticarUsuario(@RequestBody LoginDTO loginDTO) {
        Optional<Usuario> usuario = usuarioService.validarLogin(loginDTO);

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get().getId());
        } else {
            return ResponseEntity.status(401).body("Falha na autenticação: credenciais inválidas.");
        }
    }
}