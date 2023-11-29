package br.com.fiap.health.hear.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UsuarioDTO {
    private Long id;
    private String email;
    private String senha;
    private String cpf;
    private String imagem;
}