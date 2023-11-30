package br.com.fiap.health.hear.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "RESPOSTA")
public class Resposta {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SQ_RESPOSTA")
    @SequenceGenerator(name = "SQ_RESPOSTA", sequenceName = "SQ_RESPOSTA", allocationSize = 1)
    @Column(name = "ID_RESPOSTA")
    private Long id;

    @Column(name = "DATA_RESPOSTA", nullable = false)
    @NotNull(message = "O campo data não pode estar vazio.")
    @PastOrPresent
    private Date data;

    @Column(name = "DESCRICAO_RESPOSTA", nullable = false, length = 500)
    @NotBlank(message = "O campo descricao não pode estar vazio.")
    private String descricao;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "ID_USUARIO", referencedColumnName = "ID_USUARIO", foreignKey = @ForeignKey(name = "FK_RESPOSTA_USUARIO"))
    @NotNull(message = "O campo usuario não pode estar vazio.")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "ID_FEEDBACK", referencedColumnName = "ID_FEEDBACK", foreignKey = @ForeignKey(name = "FK_RESPOSTA_FEEDBACK"))
    @NotNull(message = "O campo feedback não pode estar vazio.")
    private Feedback feedback;
}