package br.com.fiap.health.hear.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ESPECIALIDADE", uniqueConstraints = {
        @UniqueConstraint(name = "UK_NOME_ESPECIALIDADE", columnNames = "NOME_ESPECIALIDADE")
})
public class Especialidade {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SQ_ESPECIALIDADE")
    @SequenceGenerator(name = "SQ_ESPECIALIDADE", sequenceName = "SQ_ESPECIALIDADE", allocationSize = 1)
    @Column(name = "ID_ESPECIALIDADE")
    private Long id;

    @Column(name = "NOME_ESPECIALIDADE", nullable = false)
    @NotBlank(message = "O campo nome não pode estar vazio.")
    private String nome;

    @JsonBackReference
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "REGISTRO_ESPECIALIDADE",
            joinColumns = {
                    @JoinColumn(
                            name = "ID_ESPECIALIDADE",
                            referencedColumnName = "ID_ESPECIALIDADE",
                            foreignKey = @ForeignKey(name = "FK_REGISTRO_ESPECIALIDADE_ESPECIALIDADE")
                    )
            },
            inverseJoinColumns = {
                    @JoinColumn(
                            name = "ID_REGISTRO",
                            referencedColumnName = "ID_REGISTRO",
                            foreignKey = @ForeignKey(name = "FK_REGISTRO_ESPECIALIDADE_REGISTRO")
                    )
            }
    )
    private Set<Registro> registros = new LinkedHashSet<>();

    public Optional<Especialidade> addRegistro(Registro registro) {
        if (this.registros == null) {
            this.registros = new LinkedHashSet<>();
        }
        this.registros.add(registro);
        if (!registro.getEspecialidades().contains(this)) registro.getEspecialidades().add(this);
        return Optional.of(this);
    }    

    public Especialidade removeRegistro(Registro registro) {
        this.registros.remove(registro);
        if (registro.getEspecialidades().contains(this)) registro.removeEspecialidade(this);
        return this;
    }
}