package br.com.fiap.health.hear.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RespostaDTO {
    private Long id;
    private Date data;
    private String descricao;
    private Long idUsuario;
    private Long idFeedback;
}