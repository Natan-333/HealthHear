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

import java.util.Optional;

@Service
public class RespostaService {

    @Autowired
    private RespostaRepository respostaRepository;

    
    public Page<RespostaDTO> listAll(Pageable pageRequest) {
        return respostaRepository.findAll(pageRequest).map(this::convertToDto);
    }
    
    public RespostaDTO findById(Long id) {
        Resposta resposta = findEntityById(id);
        return convertToDto(resposta);
    }
    
    public RespostaDTO create(RespostaDTO newData) {
        Resposta entity = convertToEntity(newData);
        Resposta savedEntity = respostaRepository.save(entity);
        return convertToDto(savedEntity);
    }
    
    public RespostaDTO update(Long id, RespostaDTO updatedData) {
        Resposta entity = findEntityById(id);
        updatedData.setId(id);
        Resposta updatedEntity = convertToEntity(updatedData);
        updatedEntity.setId(entity.getId()); 
        Resposta savedEntity = respostaRepository.save(updatedEntity);
        return convertToDto(savedEntity);
    }
    
    public void delete(Long id) {
        Resposta entity = findEntityById(id);
        respostaRepository.delete(entity);
    }
    
    public Resposta findEntityById(Long id) {
        return respostaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "(Resposta) - Resposta não encontrada por ID: " + id));
    }
    
    private RespostaDTO convertToDto(Resposta resposta) {
        RespostaDTO dto = new RespostaDTO();
        dto.setId(resposta.getId());
        dto.setData(resposta.getData());
        dto.setDescricao(resposta.getDescricao());
        dto.setIdUsuario(resposta.getUsuario().getId());
        dto.setIdFeedback(resposta.getFeedback().getId());
        return dto;
    }

    private Resposta convertToEntity(RespostaDTO dto) {
        Resposta resposta = new Resposta();
        dto.setId(resposta.getId());
        dto.setData(resposta.getData());
        dto.setDescricao(resposta.getDescricao());
        dto.setIdUsuario(resposta.getUsuario().getId());
        dto.setIdFeedback(resposta.getFeedback().getId());
        return resposta;
    }


}
