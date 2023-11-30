package br.com.fiap.health.hear.dto;

import jakarta.validation.constraints.*;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RegistroDTO {

    private Long id;

    @NotBlank(message = "O campo numero não pode estar vazio.")
    private String numero;

    @NotBlank(message = "O campo tipo não pode estar vazio.")
    private String uf;

    @NotBlank(message = "O campo tipoRegistro não pode estar vazio.")
    private String tipoRegistro;

    private Long idUsuario;

    private Set<Long> idEspecialidades;
}