package br.com.fiap.health.hear.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "USUARIO", uniqueConstraints = {
        @UniqueConstraint(name = "UK_EMAIL_USUARIO", columnNames = "EMAIL_USUARIO"),
        @UniqueConstraint(name = "UK_CPF_USUARIO", columnNames = "CPF_USUARIO")
})
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SQ_USUARIO")
    @SequenceGenerator(name = "SQ_USUARIO", sequenceName = "SQ_USUARIO", allocationSize = 1)
    @Column(name = "ID_USUARIO")
    private Long id;

    @Column(name = "NOME_USUARIO", nullable = false)
    @NotBlank(message = "O campo nome não pode estar vazio.")
    private String nome;

    @Column(name = "EMAIL_USUARIO", nullable = false)
    @NotBlank(message = "O campo email não pode estar vazio.")
    @Email(message = "Endereço de e-mail inválido.")
    private String email;

    @Column(name = "SENHA_USUARIO", nullable = false)
    @NotBlank(message = "O campo senha não pode estar vazio.")
    @JsonIgnore
    private String senha;

    @Column(name = "CPF_USUARIO", nullable = false)
    @NotBlank(message = "O campo cpf não pode estar vazio.")
    @Size(min = 11, max = 11, message = "O CPF deve ter 11 caracteres.")
    private String cpf;

    @Column(name = "IMAGEM_USUARIO")
    private String imagem;
}