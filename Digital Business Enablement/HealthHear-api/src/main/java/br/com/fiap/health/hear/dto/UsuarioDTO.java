package br.com.fiap.health.hear.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
    private String senha;
    private String cpf;
    private String imagem;
}