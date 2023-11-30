package br.com.fiap.health.hear.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EspecialidadeDTO {
    private Long id;
    private String nome;
    private Set<Long> idRegistros;
}