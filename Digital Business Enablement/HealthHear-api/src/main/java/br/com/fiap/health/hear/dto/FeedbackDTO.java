package br.com.fiap.health.hear.dto;

import jakarta.validation.constraints.*;

import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDTO {

    private Long id;

    @NotNull(message = "O campo data não pode estar vazio.")
    @PastOrPresent
    private Date data;

    @NotBlank(message = "O campo titulo não pode estar vazio.")
    private String titulo;

    @NotBlank(message = "O campo descricao não pode estar vazio.")
    private String descricao;

    @NotNull(message = "O campo nota não pode estar vazio.")
    @Positive
    @Min(1) @Max(5)
    private BigDecimal nota;

    @NotNull(message = "O campo idPaciente não pode estar vazio.")
    private Long idPaciente;

    @NotNull(message = "O campo idRegistro não pode estar vazio.")
    private Long idRegistro;

    @NotNull(message = "O campo isAnonimo não pode estar vazio.")
    private Boolean isAnonimo;

    private String acao;

    private String imagem;

    @NotBlank(message = "O campo tipo não pode estar vazio.")
    private String tipo;
}