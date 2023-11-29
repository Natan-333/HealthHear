package br.com.fiap.health.hear.controller;

import br.com.fiap.health.hear.dto.FeedbackDTO;
import br.com.fiap.health.hear.service.FeedbackService;
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
@RequestMapping("feedbacks")
@Slf4j
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public ResponseEntity<Page<FeedbackDTO>> listAll(
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.ASC) Pageable pageRequest
    ) {
        log.info("(Feedback) - Buscando todos(as)");
        return ResponseEntity.ok(feedbackService.listAll(pageRequest));
    }

    @GetMapping("{id}")
    public ResponseEntity<FeedbackDTO> findById(@PathVariable Long id) {
        log.info("(Feedback) - Exibindo por ID: " + id);
        return ResponseEntity.ok(feedbackService.findById(id));
    }

    @PostMapping
    public ResponseEntity<FeedbackDTO> create(@RequestBody @Valid FeedbackDTO newData) {
        log.info("(Feedback) - Cadastrando: " + newData);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.create(newData));
    }

    @PutMapping("{id}")
    public ResponseEntity<FeedbackDTO> update(@PathVariable Long id, @RequestBody @Valid FeedbackDTO updatedData) {
        log.info("(Feedback) - Atualizando por ID: " + id);
        return ResponseEntity.ok(feedbackService.update(id, updatedData));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("(Feedback) - Deletando por ID: " + id);
        feedbackService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
