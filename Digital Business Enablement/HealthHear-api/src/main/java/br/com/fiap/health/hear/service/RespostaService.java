package br.com.fiap.health.hear.service;

import br.com.fiap.health.hear.dto.RespostaDTO;
import br.com.fiap.health.hear.model.Resposta;
import br.com.fiap.health.hear.repository.RespostaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
public class RespostaService {

    @Autowired
    private RespostaRepository respostaRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private FeedbackService feedbackService;

    public Page<RespostaDTO> listAll(Pageable pageRequest) {
        return respostaRepository.findAll(pageRequest).map(this::convertToDto);
    }

    public RespostaDTO findById(Long id) {
        Resposta entity = findEntityById(id);
        return convertToDto(entity);
    }

    public RespostaDTO create(RespostaDTO newData) {
        Resposta entity = convertToEntity(newData);
        Resposta savedEntity = respostaRepository.save(entity);
        return convertToDto(savedEntity);
    }

    public RespostaDTO update(Long id, RespostaDTO updatedData) {
        findEntityById(id);
        updatedData.setId(id);
        Resposta updatedEntity = convertToEntity(updatedData);    
        Resposta savedEntity = respostaRepository.save(updatedEntity);
        return convertToDto(savedEntity);
    }

    public void delete(Long id) {
        Resposta entity = findEntityById(id);
        respostaRepository.delete(entity);
    }

    public Resposta findEntityById(Long id) {
        return respostaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,  "(" + getClass().getSimpleName() + ") - Resposta não encontrada por ID: " + id));
    }

    private RespostaDTO convertToDto(Resposta entity) {
        RespostaDTO dto = new RespostaDTO();
        dto.setId(entity.getId());
        dto.setData(entity.getData());
        dto.setDescricao(entity.getDescricao());
        dto.setIdUsuario(entity.getUsuario() != null ? entity.getUsuario().getId() : null);
        dto.setIdFeedback(entity.getFeedback() != null ? entity.getFeedback().getId() : null);
        return dto;
    }

    private Resposta convertToEntity(RespostaDTO dto) {
        if (Objects.isNull(dto)) {
            throw new IllegalArgumentException("(" + getClass().getSimpleName() + ") - RespostaDTO não pode ser nulo.");
        }
        Resposta entity;
        if (dto.getId() != null) {
            entity = findEntityById(dto.getId());
        } else {
            entity = new Resposta();
        }
        if (dto.getIdUsuario() == null) {
            throw new IllegalArgumentException("(" + getClass().getSimpleName() + ") - ID Usuario não pode ser nulo.");
        }
        if (dto.getIdFeedback() == null) {
            throw new IllegalArgumentException("(" + getClass().getSimpleName() + ") - ID Feedback não pode ser nulo.");
        }
        entity.setData(dto.getData());
        entity.setDescricao(dto.getDescricao());
        entity.setUsuario(usuarioService.findEntityById(dto.getIdUsuario()));
        entity.setFeedback(feedbackService.findEntityById(dto.getIdFeedback()));
        return entity;
    }
}