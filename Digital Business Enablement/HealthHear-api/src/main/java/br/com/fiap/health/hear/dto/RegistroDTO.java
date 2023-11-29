package br.com.fiap.health.hear.dto;

import br.com.fiap.health.hear.model.Especialidade;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RegistroDTO {
    private Long id;
    private String numero;
    private Long uf;
    private Long tipoRegistro;
    private Long idUsuario;
    private Set<Long> idEspecialidades;
}