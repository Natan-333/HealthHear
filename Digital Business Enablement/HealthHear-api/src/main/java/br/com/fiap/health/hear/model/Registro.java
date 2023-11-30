package br.com.fiap.health.hear.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "REGISTRO")
public class Registro {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SQ_REGISTRO")
    @SequenceGenerator(name = "SQ_REGISTRO", sequenceName = "SQ_REGISTRO", allocationSize = 1)
    @Column(name = "ID_REGISTRO")
    private Long id;

    @Column(name = "NUMERO_REGISTRO", nullable = false)
    @NotBlank(message = "O campo numero não pode estar vazio.")
    private String numero;

    @Column(name = "TIPO_REGISTRO", nullable = false)
    @NotBlank(message = "O campo tipoRegistro não pode estar vazio.")
    private String tipoRegistro;

    @Column(name = "UF_REGISTRO", nullable = false)
    @NotBlank(message = "O campo uf não pode estar vazio.")
    private String uf;

    @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "ID_USUARIO", referencedColumnName = "ID_USUARIO", foreignKey = @ForeignKey(name = "FK_REGISTRO_USUARIO"))
    private Usuario usuario;

    @JsonManagedReference
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
    private Set<Especialidade> especialidades = new LinkedHashSet<>();

    public Optional<Registro> addEspecialidade(Especialidade especialidade) {
        if (this.especialidades == null) {
            this.especialidades = new LinkedHashSet<>();
        }
        this.especialidades.add(especialidade);
        if (!especialidade.getRegistros().contains(this)) especialidade.getRegistros().add(this);
        return Optional.of(this);
    }    

    public Registro removeEspecialidade(Especialidade especialidade) {
        this.especialidades.remove(especialidade);
        if (especialidade.getRegistros().contains(this)) especialidade.removeRegistro(this);
        return this;
    }
}