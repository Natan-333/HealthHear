package br.com.fiap.health.hear.controller;

import br.com.fiap.health.hear.dto.RegistroDTO;
import br.com.fiap.health.hear.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

import jakarta.validation.Valid;

import java.util.Set;

@RestController
@RequestMapping("registros")
@Slf4j
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    @GetMapping
    public ResponseEntity<Page<RegistroDTO>> listAll(
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.ASC) Pageable pageRequest
    ) {
        log.info("(Registro) - Buscando todos(as)");
        return ResponseEntity.ok(registroService.listAll(pageRequest));
    }

    @GetMapping("{id}")
    public ResponseEntity<RegistroDTO> findById(@PathVariable Long id) {
        log.info("(Registro) - Exibindo por ID: " + id);
        return ResponseEntity.ok(registroService.findById(id));
    }

    @PostMapping
    public ResponseEntity<RegistroDTO> create(@RequestBody @Valid RegistroDTO newData) {
        log.info("(Registro) - Cadastrando: " + newData);
        return ResponseEntity.status(HttpStatus.CREATED).body(registroService.create(newData));
    }

    @PutMapping("{id}")
    public ResponseEntity<RegistroDTO> update(@PathVariable Long id, @RequestBody @Valid RegistroDTO updatedData) {
        log.info("(Registro) - Atualizando por ID: " + id);
        return ResponseEntity.ok(registroService.update(id, updatedData));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("(Registro) - Deletando por ID: " + id);
        registroService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
