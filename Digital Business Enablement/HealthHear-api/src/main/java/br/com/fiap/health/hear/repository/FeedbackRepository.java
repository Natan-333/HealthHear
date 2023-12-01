package br.com.fiap.health.hear.repository;

import br.com.fiap.health.hear.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Page<Feedback> findByPacienteId(Long usuarioId, Pageable pageRequest);
}