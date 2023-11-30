package br.com.fiap.health.hear.controller;

import br.com.fiap.health.hear.dto.RespostaDTO;
import br.com.fiap.health.hear.model.Resposta;
import br.com.fiap.health.hear.service.RespostaService;

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
@RequestMapping("respostas")
@Slf4j
public class RespostaController {

    @Autowired
    private RespostaService respostaService;

    @GetMapping
    public ResponseEntity<Page<Resposta>> listAll(
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        log.info("(" + getClass().getSimpleName() + ") - Buscando todos(as)");
        return ResponseEntity.ok(respostaService.listAll(pageable));
    }

    @GetMapping("{id}")
    public ResponseEntity<Resposta> findById(@PathVariable Long id) {
        log.info("(" + getClass().getSimpleName() + ") - Exibindo por ID: " + id);
        return ResponseEntity.ok(respostaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Resposta> create(@RequestBody @Valid RespostaDTO newData) {
        log.info("(" + getClass().getSimpleName() + ") - Cadastrando: " + newData);
        return ResponseEntity.status(HttpStatus.CREATED).body(respostaService.create(newData));
    }

    @PutMapping("{id}")
    public ResponseEntity<Resposta> update(@PathVariable Long id, @RequestBody @Valid RespostaDTO updatedData) {
        log.info("(" + getClass().getSimpleName() + ") - Atualizando por ID: " + id);
        return ResponseEntity.ok(respostaService.update(id, updatedData));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("(" + getClass().getSimpleName() + ") - Deletando por ID: " + id);
        respostaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
