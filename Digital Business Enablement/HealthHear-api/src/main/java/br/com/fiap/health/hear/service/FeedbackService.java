package br.com.fiap.health.hear.service;

import br.com.fiap.health.hear.dto.FeedbackDTO;
import br.com.fiap.health.hear.model.Feedback;
import br.com.fiap.health.hear.repository.FeedbackRepository;
import br.com.fiap.health.hear.repository.RegistroRepository;
import br.com.fiap.health.hear.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private RegistroRepository registroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Page<FeedbackDTO> listAll(Pageable pageRequest) {
        return feedbackRepository.findAll(pageRequest).map(this::convertToDto);
    }

    public FeedbackDTO findById(Long id) {
        Feedback feedback = findEntityById(id);
        return convertToDto(feedback);
    }

    public FeedbackDTO create(FeedbackDTO newData) {
        Feedback entity = convertToEntity(newData);
        Feedback savedEntity = feedbackRepository.save(entity);
        return convertToDto(savedEntity);
    }

    public FeedbackDTO update(Long id, FeedbackDTO updatedData) {
        Feedback entity = findEntityById(id);
        updatedData.setId(id);
        Feedback updatedEntity = convertToEntity(updatedData);
        updatedEntity.setId(entity.getId());
        Feedback savedEntity = feedbackRepository.save(updatedEntity);
        return convertToDto(savedEntity);
    }

    public void delete(Long id) {
        Feedback entity = findEntityById(id);
        feedbackRepository.delete(entity);
    }

    public Feedback findEntityById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "(Feedback) - Feedback não encontrado por ID: " + id));
    }

    private FeedbackDTO convertToDto(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setData(feedback.getData());
        dto.setTitulo(feedback.getTitulo());
        dto.setDescricao(feedback.getDescricao());
        dto.setNota(feedback.getNota());
        dto.setIdPaciente(feedback.getPaciente().getId());
        dto.setIdRegistro(feedback.getRegistro().getId());
        dto.setIsAnonimo(feedback.getIsAnonimo() ? 1 : 0);
        dto.setAcao(feedback.getAcao());
        dto.setImagem(feedback.getImagem());
        dto.setTipo(feedback.getTipo());
        return dto;
    }

    private Feedback convertToEntity(FeedbackDTO dto) {
        Feedback feedback = new Feedback();
        feedback.setId(dto.getId());
        feedback.setData(dto.getData());
        feedback.setTitulo(dto.getTitulo());
        feedback.setDescricao(dto.getDescricao());
        feedback.setNota(dto.getNota());
        feedback.setPaciente(usuarioRepository.findById(dto.getIdPaciente())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "(Feedback) - Paciente não encontrado por ID: " + dto.getIdPaciente())));
        feedback.setRegistro(registroRepository.findById(dto.getIdRegistro())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "(Feedback) - Registro não encontrado por ID: " + dto.getIdRegistro())));
        feedback.setIsAnonimo(dto.getIsAnonimo() != null && dto.getIsAnonimo() == 1); // Mapeando para Boolean conforme o modelo
        feedback.setAcao(dto.getAcao());
        feedback.setImagem(dto.getImagem());
        feedback.setTipo(dto.getTipo());
        return feedback;
    }
}
