package br.com.fiap.health.hear.dto;

import jakarta.validation.constraints.*;

import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespostaDTO {

    private Long id;

    @NotNull(message = "O campo data não pode estar vazio.")
    @PastOrPresent
    private Date data;

    @NotBlank(message = "O campo descricao não pode estar vazio.")
    private String descricao;

    @NotNull(message = "O campo idUsuario não pode estar vazio.")
    private Long idUsuario;

    @NotNull(message = "O campo idFeedback não pode estar vazio.")
    private Long idFeedback;
}