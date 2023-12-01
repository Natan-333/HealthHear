package br.com.fiap.health.hear.dto;

import jakarta.validation.constraints.*;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroBuscarOuCriarDTO {

    @NotBlank(message = "O campo numero não pode estar vazio.")
    private String numero;

    @NotBlank(message = "O campo tipo não pode estar vazio.")
    private String uf;

    @NotBlank(message = "O campo tipoRegistro não pode estar vazio.")
    private String tipoRegistro;
}