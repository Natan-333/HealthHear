package br.com.fiap.health.hear.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FeedbackDTO {
    private Long id;
    private Date data;
    private String titulo;
    private String descricao;
    private Double nota;
    private Long idPaciente;
    private Long idRegistro;
    private Integer isAnonimo;
    private String acao;
    private String imagem;
    private String tipo;
}