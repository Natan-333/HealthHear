package br.com.fiap.health.hear.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "FEEDBACK")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SQ_FEEDBACK")
    @SequenceGenerator(name = "SQ_FEEDBACK", sequenceName = "SQ_FEEDBACK", allocationSize = 1)
    @Column(name = "ID_FEEDBACK")
    private Long id;

    @Column(name = "DATA_FEEDBACK", nullable = false)
    @NotNull(message = "O campo data não pode estar vazio.")
    @PastOrPresent
    @Temporal(TemporalType.DATE)
    private Date data;

    @Column(name = "TITULO_FEEDBACK", nullable = false, length = 255)
    @NotBlank(message = "O titulo data não pode estar vazio.")
    private String titulo;

    @Column(name = "DESCRICAO_FEEDBACK", nullable = false, length = 500)
    @NotBlank(message = "O campo descricao não pode estar vazio.")
    private String descricao;

    @Column(name = "NOTA_FEEDBACK", nullable = false)
    @NotNull(message = "O campo nota não pode estar vazio.")
    @Positive
    @Min(1) @Max(5)
    private BigDecimal nota;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "ID_PACIENTE", referencedColumnName = "ID_USUARIO", foreignKey = @ForeignKey(name = "FK_FEEDBACK_PACIENTE"), nullable = false)
    @NotNull(message = "O campo paciente não pode estar vazio.")
    private Usuario paciente;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "ID_REGISTRO", referencedColumnName = "ID_REGISTRO", foreignKey = @ForeignKey(name = "FK_FEEDBACK_REGISTRO"), nullable = false)
    @NotNull(message = "O campo registro não pode estar vazio.")
    private Registro registro;

    @Column(name = "IS_ANONIMO", nullable = false)
    @NotNull(message = "O campo isAnonimo não pode estar vazio.")
    private Boolean isAnonimo;

    @Column(name = "ACAO_TOMADA_FEEDBACK")
    private String acao;

    @Column(name = "EVIDENCIA_FEEDBACK")
    private String imagem;

    @Column(name = "TIPO_FEEDBACK", nullable = false)
    @NotBlank(message = "O campo tipo não pode estar vazio.")
    private String tipo;
}