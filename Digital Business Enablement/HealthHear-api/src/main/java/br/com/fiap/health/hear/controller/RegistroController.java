package br.com.fiap.health.hear.controller;

import br.com.fiap.health.hear.dto.RegistroDTO;
import br.com.fiap.health.hear.model.Registro;
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

@RestController
@RequestMapping("registros")
@Slf4j
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    @GetMapping
    public ResponseEntity<Page<Registro>> listAll(
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.ASC) Pageable pageRequest
    ) {
        log.info("(" + getClass().getSimpleName() + ") - Buscando todos(as)");
        return ResponseEntity.ok(registroService.listAll(pageRequest));
    }

    @GetMapping("{id}")
    public ResponseEntity<Registro> findById(@PathVariable Long id) {
        log.info("(" + getClass().getSimpleName() + ") - Exibindo por ID: " + id);
        return ResponseEntity.ok(registroService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Registro> create(@RequestBody @Valid RegistroDTO newData) {
        log.info("(" + getClass().getSimpleName() + ") - Cadastrando: " + newData);
        return ResponseEntity.status(HttpStatus.CREATED).body(registroService.create(newData));
    }

    @PutMapping("{id}")
    public ResponseEntity<Registro> update(@PathVariable Long id, @RequestBody @Valid RegistroDTO updatedData) {
        log.info("(" + getClass().getSimpleName() + ") - Atualizando por ID: " + id);
        return ResponseEntity.ok(registroService.update(id, updatedData));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("(" + getClass().getSimpleName() + ") - Deletando por ID: " + id);
        registroService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/findOrCreate")
    public ResponseEntity<Registro> findOrCreate(@RequestParam String numero, @RequestParam String uf, @RequestParam String tipoRegistro) {
        Registro registro = registroService.findOrCreate(numero, uf, tipoRegistro);
        return ResponseEntity.ok(registro);
    }
}
