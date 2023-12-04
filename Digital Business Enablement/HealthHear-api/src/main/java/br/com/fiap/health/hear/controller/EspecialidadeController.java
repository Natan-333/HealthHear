package br.com.fiap.health.hear.controller;

import br.com.fiap.health.hear.dto.EspecialidadeDTO;
import br.com.fiap.health.hear.model.Especialidade;
import br.com.fiap.health.hear.service.EspecialidadeService;

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

@RestController
@RequestMapping("especialidades")
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EspecialidadeController {

    @Autowired
    private EspecialidadeService especialidadeService;

    @GetMapping
    public ResponseEntity<Page<Especialidade>> listAll(
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.ASC) Pageable pageRequest
    ) {
        log.info("(" + getClass().getSimpleName() + ") - Buscando todos(as)");
        return ResponseEntity.ok(especialidadeService.listAll(pageRequest));
    }

    @GetMapping("{id}")
    public ResponseEntity<Especialidade> findById(@PathVariable Long id) {
        log.info("(" + getClass().getSimpleName() + ") - Exibindo por ID: " + id);
        return ResponseEntity.ok(especialidadeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Especialidade> create(@RequestBody @Valid EspecialidadeDTO newData) {
        log.info("(" + getClass().getSimpleName() + ") - Cadastrando: " + newData);
        return ResponseEntity.status(HttpStatus.CREATED).body(especialidadeService.create(newData));
    }

    @PutMapping("{id}")
    public ResponseEntity<Especialidade> update(@PathVariable Long id, @RequestBody @Valid EspecialidadeDTO updatedData) {
        log.info("(" + getClass().getSimpleName() + ") - Atualizando por ID: " + id);
        return ResponseEntity.ok(especialidadeService.update(id, updatedData));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("(" + getClass().getSimpleName() + ") - Deletando por ID: " + id);
        especialidadeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
