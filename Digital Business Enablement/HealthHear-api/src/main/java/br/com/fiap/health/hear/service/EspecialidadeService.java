package br.com.fiap.health.hear.service;

import br.com.fiap.health.hear.dto.EspecialidadeDTO;
import br.com.fiap.health.hear.model.Especialidade;
import br.com.fiap.health.hear.repository.EspecialidadeRepository;

import br.com.fiap.health.hear.model.Registro;

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
public class EspecialidadeService {

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    @Autowired
    private RegistroService registroService;

    public Page<Especialidade> listAll(Pageable pageRequest) {
        return especialidadeRepository.findAll(pageRequest);
    }

    public Especialidade findById(Long id) {
        Especialidade entity = findEntityById(id);
        return entity;
    }

    @Transactional
    public Especialidade create(EspecialidadeDTO newData) {
        Especialidade entity = convertToEntity(newData);
        Especialidade savedEntity = especialidadeRepository.save(entity);
        return savedEntity;
    }

    @Transactional
    public Especialidade update(Long id, EspecialidadeDTO updatedData) {
        findEntityById(id);
        updatedData.setId(id);
        Especialidade updatedEntity = convertToEntity(updatedData);    
        Especialidade savedEntity = especialidadeRepository.save(updatedEntity);
        return savedEntity;
    }

    @Transactional
    public void delete(Long id) {
        Especialidade entity = findEntityById(id);
        if (entity.getRegistros() != null) {
            for (Registro registro : entity.getRegistros()) {
                registro.removeEspecialidade(entity);
            }
        }
        especialidadeRepository.delete(entity);
    }

    public Especialidade findEntityById(Long id) {
        return especialidadeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,  "(" + getClass().getSimpleName() + ") - Especialidade não encontrada por ID: " + id));
    }

    // private EspecialidadeDTO convertToDto(Especialidade entity) {
    //     EspecialidadeDTO dto = new EspecialidadeDTO();
    //     dto.setId(entity.getId());
    //     dto.setNome(entity.getNome());
    //     if (entity.getRegistros() != null) {
    //         Set<Long> idsRegistros = entity.getRegistros().stream()
    //                 .map(Registro::getId)
    //                 .collect(Collectors.toSet());
    //         dto.setIdRegistros(idsRegistros);
    //     }
    //     return dto;
    // }

    private Especialidade convertToEntity(EspecialidadeDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("(" + getClass().getSimpleName() + ") - EspecialidadeDTO não pode ser nulo.");
        }
        Especialidade entity;
        if (dto.getId() != null) {
            entity = findEntityById(dto.getId());
            entity.setNome(dto.getNome());
            Set<Registro> newRegistros = new LinkedHashSet<>();
            if (dto.getIdRegistros() != null) {
                dto.getIdRegistros().forEach(id -> {
                    Registro registro = registroService.findEntityById(id);
                    newRegistros.add(registro);
                });
            }
            entity.setRegistros(newRegistros);
        } else {
            entity = new Especialidade();
            entity.setNome(dto.getNome());
            if (dto.getIdRegistros() != null) {
                dto.getIdRegistros().forEach(id -> {
                    Registro registro = registroService.findEntityById(id);
                    entity.addRegistro(registro);
                });
            }
        }
        return entity;
    }
}