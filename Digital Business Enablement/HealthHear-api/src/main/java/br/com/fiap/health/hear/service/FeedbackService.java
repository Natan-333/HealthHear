package br.com.fiap.health.hear.service;

import br.com.fiap.health.hear.dto.FeedbackDTO;
import br.com.fiap.health.hear.model.Feedback;
import br.com.fiap.health.hear.repository.FeedbackRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private RegistroService registroService;

    public Page<Feedback> listAll(Pageable pageRequest) {
        return feedbackRepository.findAll(pageRequest);
    }

    public Feedback findById(Long id) {
        Feedback entity = findEntityById(id);
        return entity;
    }

    @Transactional
    public Feedback create(FeedbackDTO newData) {
        Feedback entity = convertToEntity(newData);
        Feedback savedEntity = feedbackRepository.save(entity);
        return savedEntity;
    }

    @Transactional
    public Feedback update(Long id, FeedbackDTO updatedData) {
        findEntityById(id);
        updatedData.setId(id);
        Feedback updatedEntity = convertToEntity(updatedData);    
        Feedback savedEntity = feedbackRepository.save(updatedEntity);
        return savedEntity;
    }

    @Transactional
    public void delete(Long id) {
        Feedback entity = findEntityById(id);
        feedbackRepository.delete(entity);
    }

    public Feedback findEntityById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,  "(" + getClass().getSimpleName() + ") - Feedback não encontrada por ID: " + id));
    }

    public Page<Feedback> listByPacienteId(Long usuarioId, Pageable pageRequest) {
        return feedbackRepository.findByPacienteId(usuarioId, pageRequest);
    }

    // private FeedbackDTO convertToDto(Feedback entity) {
    //     FeedbackDTO dto = new FeedbackDTO();
    //     dto.setId(entity.getId());
    //     dto.setData(entity.getData());
    //     dto.setTitulo(entity.getTitulo());
    //     dto.setDescricao(entity.getDescricao());
    //     dto.setNota(entity.getNota());
    //     dto.setIdPaciente(entity.getPaciente() != null ? entity.getPaciente().getId() : null);
    //     dto.setIdRegistro(entity.getRegistro() != null ? entity.getRegistro().getId() : null);
    //     dto.setIsAnonimo(entity.getIsAnonimo());
    //     dto.setAcao(entity.getAcao());
    //     dto.setImagem(entity.getImagem());
    //     dto.setTipo(entity.getTipo());
    //     return dto;
    // }

    private Feedback convertToEntity(FeedbackDTO dto) {
        if (Objects.isNull(dto)) {
            throw new IllegalArgumentException("(" + getClass().getSimpleName() + ") - FeedbackDTO não pode ser nulo.");
        }
        Feedback entity;
        if (dto.getId() != null) {
            entity = findEntityById(dto.getId());
        } else {
            entity = new Feedback();
        }
        if (dto.getIdPaciente() == null) {
            throw new IllegalArgumentException("(" + getClass().getSimpleName() + ") - ID Paciente não pode ser nulo.");
        }
        if (dto.getIdRegistro() == null) {
            throw new IllegalArgumentException("(" + getClass().getSimpleName() + ") - ID Registro não pode ser nulo.");
        }
        entity.setData(dto.getData());
        entity.setTitulo(dto.getTitulo());
        entity.setDescricao(dto.getDescricao());
        entity.setNota(dto.getNota());
        entity.setPaciente(usuarioService.findEntityById(dto.getIdPaciente()));
        entity.setRegistro(registroService.findEntityById(dto.getIdRegistro()));
        entity.setIsAnonimo(dto.getIsAnonimo());
        entity.setAcao(dto.getAcao());
        entity.setImagem(dto.getImagem());
        entity.setTipo(dto.getTipo());
        return entity;
    }
}