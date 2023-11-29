package br.com.fiap.health.hear.service;

import br.com.fiap.health.hear.dto.UsuarioDTO;
import br.com.fiap.health.hear.model.Usuario;
import br.com.fiap.health.hear.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Page<UsuarioDTO> listAll(Pageable pageRequest) {
        return usuarioRepository.findAll(pageRequest).map(this::convertToDto);
    }

    public UsuarioDTO findById(Long id) {
        Usuario usuario = findEntityById(id);
        return convertToDto(usuario);
    }

    public UsuarioDTO create(UsuarioDTO newData) {
        Usuario entity = convertToEntity(newData);
        Usuario savedEntity = usuarioRepository.save(entity);
        return convertToDto(savedEntity);
    }

    public UsuarioDTO update(Long id, UsuarioDTO updatedData) {
        Usuario entity = findEntityById(id);
        updatedData.setId(id);
        Usuario updatedEntity = convertToEntity(updatedData);
        updatedEntity.setId(entity.getId());
        Usuario savedEntity = usuarioRepository.save(updatedEntity);
        return convertToDto(savedEntity);
    }

    public void delete(Long id) {
        Usuario entity = findEntityById(id);
        usuarioRepository.delete(entity);
    }

    public Usuario findEntityById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "(Usuario) - Usuario não encontrado(a) por ID: " + id));
    }

    private UsuarioDTO convertToDto(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setEmail(usuario.getEmail());
        dto.setSenha(usuario.getSenha());
        dto.setCpf(usuario.getCpf());
        dto.setImagem(usuario.getImagem());

        return dto;
    }

    private Usuario convertToEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setId(dto.getId());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setCpf(dto.getCpf());
        usuario.setImagem(dto.getImagem());

        return usuario;
    }


}
