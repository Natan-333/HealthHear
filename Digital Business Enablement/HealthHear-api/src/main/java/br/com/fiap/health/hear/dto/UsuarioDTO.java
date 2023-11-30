package br.com.fiap.health.hear.dto;

import jakarta.validation.constraints.*;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {

    private Long id;

    @NotBlank(message = "O campo nome não pode estar vazio.")
    private String nome;

    @NotBlank(message = "O campo email não pode estar vazio.")
    @Email(message = "Endereço de e-mail inválido.")
    private String email;

    @NotBlank(message = "O campo senha não pode estar vazio.")
    private String senha;

    @NotBlank(message = "O campo cpf não pode estar vazio.")
    private String cpf;

    private String imagem;
}