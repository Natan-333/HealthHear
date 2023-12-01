package br.com.fiap.health.hear.repository;

import br.com.fiap.health.hear.model.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistroRepository extends JpaRepository<Registro, Long> {

    Optional<Registro> findByNumeroAndUfAndTipoRegistro(String numero, String uf, String tipoRegistro);
    
}