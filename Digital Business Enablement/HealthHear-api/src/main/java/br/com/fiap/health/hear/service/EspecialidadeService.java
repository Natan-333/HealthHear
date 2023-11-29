package br.com.fiap.health.hear.service;

import br.com.fiap.health.hear.dto.EspecialidadeDTO;
import br.com.fiap.health.hear.model.Especialidade;
import br.com.fiap.health.hear.model.Registro;
import br.com.fiap.health.hear.repository.EspecialidadeRepository;
import br.com.fiap.health.hear.repository.RegistroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;


@Service
public class EspecialidadeService {

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    @Autowired
    private RegistroRepository registroRepository;

    public Page<EspecialidadeDTO> listAll(Pageable pageRequest) {
        return especialidadeRepository.findAll(pageRequest).map(this::convertToDto);
    }

    public EspecialidadeDTO findById(Long id) {
        Especialidade especialidade = findEntityById(id);
        return convertToDto(especialidade);
    }

    public EspecialidadeDTO create(EspecialidadeDTO newData) {
        Especialidade entity = convertToEntity(newData);
        Especialidade savedEntity = especialidadeRepository.save(entity);
        return convertToDto(savedEntity);
    }

    public EspecialidadeDTO update(Long id, EspecialidadeDTO updatedData) {
        Especialidade entity = findEntityById(id);
        updatedData.setId(id);
        Especialidade updatedEntity = convertToEntity(updatedData);
        updatedEntity.setId(entity.getId());
        Especialidade savedEntity = especialidadeRepository.save(updatedEntity);
        return convertToDto(savedEntity);
    }

    public void delete(Long id) {
        Especialidade entity = findEntityById(id);
        especialidadeRepository.delete(entity);
    }

    public Especialidade findEntityById(Long id) {
        return especialidadeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "(Especialidade) - Especialidade não encontrada por ID: " + id));
    }

    private EspecialidadeDTO convertToDto(Especialidade especialidade) {
        EspecialidadeDTO dto = new EspecialidadeDTO();
        dto.setId(especialidade.getId());
        dto.setNome(especialidade.getNome());

        if (especialidade.getRegistros() != null && !especialidade.getRegistros().isEmpty()) {
            Registro registro = especialidade.getRegistros().iterator().next();
            dto.setIdRegistro(registro.getId());
        }

        return dto;
    }

    private Especialidade convertToEntity(EspecialidadeDTO dto) {
        Especialidade especialidade = new Especialidade();
        especialidade.setId(dto.getId());
        especialidade.setNome(dto.getNome());

        if (dto.getIdRegistro() != null) {
            Registro registro = registroRepository.findById(dto.getIdRegistro())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "(Especialidade) - Registro não encontrado por ID: " + dto.getIdRegistro()));
            especialidade.setRegistros(Set.of(registro));
        }

        return especialidade;
    }
}
