package br.com.fiap.health.hear.service;

import br.com.fiap.health.hear.dto.RegistroDTO;
import br.com.fiap.health.hear.model.Especialidade;
import br.com.fiap.health.hear.model.Registro;
import br.com.fiap.health.hear.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class RegistroService {

    @Autowired
    private RegistroRepository registroRepository;

    public Page<RegistroDTO> listAll(Pageable pageRequest) {
        return registroRepository.findAll(pageRequest).map(this::convertToDto);
    }

    public RegistroDTO findById(Long id) {
        Registro registro = findEntityById(id);
        return convertToDto(registro);
    }

    public RegistroDTO create(RegistroDTO newData) {
        Registro entity = convertToEntity(newData);
        Registro savedEntity = registroRepository.save(entity);
        return convertToDto(savedEntity);
    }

    public RegistroDTO update(Long id, RegistroDTO updatedData) {
        Registro entity = findEntityById(id);
        updatedData.setId(id);
        Registro updatedEntity = convertToEntity(updatedData);
        updatedEntity.setId(entity.getId());
        Registro savedEntity = registroRepository.save(updatedEntity);
        return convertToDto(savedEntity);
    }

    public void delete(Long id) {
        Registro entity = findEntityById(id);
        registroRepository.delete(entity);
    }

    public Registro findEntityById(Long id) {
        return registroRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "(Registro) - Registro não encontrado por ID: " + id));
    }

    private RegistroDTO convertToDto(Registro registro) {
        RegistroDTO dto = new RegistroDTO();
        dto.setId(registro.getId());
        dto.setNumero(registro.getNumero());
        dto.setTipoRegistro(registro.getTipoRegistro());
        dto.setUf(registro.getUf());
        dto.setIdUsuario(registro.getUsuario().getId());

        dto.setIdEspecialidades(registro.getEspecialidades()
                .stream()
                .map(Especialidade::getId)
                .collect(Collectors.toSet()));

        return dto;
    }

    private Registro convertToEntity(RegistroDTO dto) {
        Registro registro = new Registro();
        registro.setId(dto.getId());
        registro.setNumero(dto.getNumero());
        registro.setTipoRegistro(dto.getTipoRegistro());
        registro.setUf(dto.getUf());

        registro.setEspecialidades(dto.getIdEspecialidades()
                .stream()
                .map(especialidadeId -> {
                    Especialidade especialidade = new Especialidade();
                    especialidade.setId(especialidadeId);
                    return especialidade;
                })
                .collect(Collectors.toSet()));

        return registro;
    }
}
