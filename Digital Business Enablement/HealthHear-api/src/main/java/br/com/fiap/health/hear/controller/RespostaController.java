package br.com.fiap.health.hear.controller;

import br.com.fiap.health.hear.dto.RespostaDTO;
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
    public ResponseEntity<Page<RespostaDTO>> listAll(
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        log.info("(Resposta) - Buscando todos(as)");
        return ResponseEntity.ok(respostaService.listAll(pageable));
    }

    @GetMapping("{id}")
    public ResponseEntity<RespostaDTO> findById(@PathVariable Long id) {
        log.info("(Resposta) - Exibindo por ID: " + id);
        return ResponseEntity.ok(respostaService.findById(id));
    }

    @PostMapping
    public ResponseEntity<RespostaDTO> create(@RequestBody @Valid RespostaDTO newData) {
        log.info("(Resposta) - Cadastrando: " + newData);
        return ResponseEntity.status(HttpStatus.CREATED).body(respostaService.create(newData));
    }

    @PutMapping("{id}")
    public ResponseEntity<RespostaDTO> update(@PathVariable Long id, @RequestBody @Valid RespostaDTO updatedData) {
        log.info("(Resposta) - Atualizando por ID: " + id);
        return ResponseEntity.ok(respostaService.update(id, updatedData));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("(Resposta) - Deletando por ID: " + id);
        respostaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
