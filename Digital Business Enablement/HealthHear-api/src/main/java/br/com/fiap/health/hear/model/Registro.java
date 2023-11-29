package br.com.fiap.health.hear.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "REGISTRO")
public class Registro {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SQ_REGISTRO")
    @SequenceGenerator(name = "SQ_REGISTRO", sequenceName = "SQ_REGISTRO", allocationSize = 1)
    @Column(name = "ID_REGISTRO")
    private Long id;

    @Column(name = "NUMERO_REGISTRO", nullable = false)
    @NotBlank(message = "O número do registro não pode estar vazio.")
    private String numero;

    @Column(name = "TIPO_REGISTRO", nullable = false)
    @NotBlank(message = "O tipo do registro não pode estar vazio.")
    private String tipoRegistro;

    @Column(name = "UF_REGISTRO", nullable = false)
    @NotBlank(message = "O uf do registro não pode estar vazio.")
    private String uf;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "ID_USUARIO", referencedColumnName = "ID_USUARIO", foreignKey = @ForeignKey(name = "FK_REGISTRO_USUARIO"))
    private Usuario usuario;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "REGISTRO_ESPECIALIDADE",
            joinColumns = {
                    @JoinColumn(
                            name = "ID_REGISTRO",
                            referencedColumnName = "ID_REGISTRO",
                            foreignKey = @ForeignKey(name = "FK_REGISTRO_ESPECIALIDADE_REGISTRO")
                    )
            },
            inverseJoinColumns = {
                    @JoinColumn(
                            name = "ID_ESPECIALIDADE",
                            referencedColumnName = "ID_ESPECIALIDADE",
                            foreignKey = @ForeignKey(name = "FK_REGISTRO_ESPECIALIDADE_ESPECIALIDADE")
                    )
            }
    )
    private Set<Especialidade> especialidades;
}