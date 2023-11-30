package br.com.fiap.health.hear.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
@Entity
@Table(name = "FEEDBACK")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SQ_FEEDBACK")
    @SequenceGenerator(name = "SQ_FEEDBACK", sequenceName = "SQ_FEEDBACK", allocationSize = 1)
    @Column(name = "ID_FEEDBACK")
    private Long id;

    @Column(name = "DATA_FEEDBACK")
    @Temporal(TemporalType.DATE)
    private Date data;

    @Column(name = "TITULO_FEEDBACK", nullable = false, length = 255)
    private String titulo;

    @Column(name = "DESCRICAO_FEEDBACK", nullable = false, length = 500)
    private String descricao;

    @Column(name = "NOTA_FEEDBACK", nullable = false)
    @Min(1)@Max(5)
    private BigDecimal nota;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "ID_PACIENTE", referencedColumnName = "ID_USUARIO", foreignKey = @ForeignKey(name = "FK_FEEDBACK_PACIENTE"))
    private Usuario paciente;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "ID_REGISTRO", referencedColumnName = "ID_REGISTRO", foreignKey = @ForeignKey(name = "FK_FEEDBACK_REGISTRO"))
    private Registro registro;

    @Column(name = "IS_ANONIMO", nullable = false)
    private Boolean isAnonimo;

    @Column(name = "ACAO_TOMADA_FEEDBACK")
    private String acao;

    @Column(name = "EVIDENCIA_FEEDBACK")
    private String imagem;

    @Column(name = "TIPO_FEEDBACK", nullable = false)
    @NotBlank(message = "O tipo do feedback não pode estar vazio.")
    private String tipo;
}