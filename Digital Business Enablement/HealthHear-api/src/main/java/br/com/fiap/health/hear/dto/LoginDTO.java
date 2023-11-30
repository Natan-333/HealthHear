package br.com.fiap.health.hear.dto;

import jakarta.validation.constraints.*;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {

    @NotBlank(message = "O endereço de e-mail não pode estar vazio.")
    @Email(message = "Endereço de e-mail inválido.")
    private String email;

    @NotBlank(message = "A senha não pode estar vazia.")
    private String senha;
}