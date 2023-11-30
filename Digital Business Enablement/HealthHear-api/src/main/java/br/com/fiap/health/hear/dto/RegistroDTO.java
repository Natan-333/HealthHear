package br.com.fiap.health.hear.dto;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RegistroDTO {
    private Long id;
    private String numero;
    private String uf;
    private String tipoRegistro;
    private Long idUsuario;
    private Set<Long> idEspecialidades;
}