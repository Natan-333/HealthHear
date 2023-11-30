package br.com.fiap.health.hear.service;

import br.com.fiap.health.hear.dto.RegistroDTO;
import br.com.fiap.health.hear.model.Registro;
import br.com.fiap.health.hear.repository.RegistroRepository;

import br.com.fiap.health.hear.model.Especialidade;
import br.com.fiap.health.hear.repository.EspecialidadeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashSet;
import java.util.Set;
// import java.util.stream.Collectors;

@Service
public class RegistroService {

    @Autowired
    private RegistroRepository registroRepository;

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    @Autowired
    private UsuarioService usuarioService;

    public Page<Registro> listAll(Pageable pageRequest) {
        return registroRepository.findAll(pageRequest);
    }

    public Registro findById(Long id) {
        Registro entity = findEntityById(id);
        return entity;
    }

    @Transactional
    public Registro create(RegistroDTO newData) {
        Registro entity = convertToEntity(newData);
        Registro savedEntity = registroRepository.save(entity);
        return savedEntity;
    }

    @Transactional
    public Registro update(Long id, RegistroDTO updatedData) {
        findEntityById(id);
        updatedData.setId(id);
        Registro updatedEntity = convertToEntity(updatedData);    
        Registro savedEntity = registroRepository.save(updatedEntity);
        return savedEntity;
    }

    @Transactional
    public void delete(Long id) {
        Registro entity = findEntityById(id);
        if (entity.getEspecialidades() != null) {
            for (Especialidade especialidade : entity.getEspecialidades()) {
                especialidade.removeRegistro(entity);
            }
        }
        registroRepository.delete(entity);
    }

    public Registro findEntityById(Long id) {
        return registroRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "(Registro) - Registro não encontrado por ID: " + id));
    }

    // private RegistroDTO convertToDto(Registro entity) {
    //     RegistroDTO dto = new RegistroDTO();
    //     dto.setId(entity.getId());
    //     dto.setNumero(entity.getNumero());
    //     dto.setUf(entity.getUf());
    //     dto.setTipoRegistro(entity.getTipoRegistro());
    //     dto.setIdUsuario(entity.getUsuario() != null ? entity.getUsuario().getId() : null);
    //     if (entity.getEspecialidades() != null) {
    //         Set<Long> idsEspecialidades = entity.getEspecialidades().stream()
    //                 .map(Especialidade::getId)
    //                 .collect(Collectors.toSet());
    //         dto.setIdEspecialidades(idsEspecialidades);
    //     }
    //     return dto;
    // }

    private Registro convertToEntity(RegistroDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("(" + getClass().getSimpleName() + ") - RegistroDTO não pode ser nulo.");
        }
        Registro entity;
        if (dto.getId() != null) {
            entity = findEntityById(dto.getId());
        } else {
            entity = new Registro();
        }
        entity.setNumero(dto.getNumero());
        entity.setUf(dto.getUf());
        entity.setTipoRegistro(dto.getTipoRegistro());
        entity.setUsuario(usuarioService.findEntityById(dto.getIdUsuario()));
        Set<Especialidade> newEspecialidades = new LinkedHashSet<>();
        if (dto.getIdEspecialidades() != null) {
            dto.getIdEspecialidades().forEach(id -> {
                Especialidade especialidade = especialidadeRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Especialidade não encontrado com ID: " + id));
                newEspecialidades.add(especialidade);
            });
        }
        entity.setEspecialidades(newEspecialidades);
        return entity;
    }
}