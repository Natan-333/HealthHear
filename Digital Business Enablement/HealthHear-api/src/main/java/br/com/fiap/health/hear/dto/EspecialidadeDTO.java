package br.com.fiap.health.hear.dto;

import jakarta.validation.constraints.*;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EspecialidadeDTO {

    private Long id;

    @NotBlank(message = "O campo nome não pode estar vazio.")
    private String nome;

    private Set<Long> idRegistros;
}