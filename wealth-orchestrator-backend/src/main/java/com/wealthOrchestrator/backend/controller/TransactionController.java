package com.wealthOrchestrator.backend.controller;

import com.wealthOrchestrator.backend.dto.TransactionDTO;
import com.wealthOrchestrator.backend.model.Transaction;
import com.wealthOrchestrator.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Transaction> all() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Optional<Transaction> get(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Transaction create(@RequestBody @Valid TransactionDTO dto) {
        return service.saveDTO(dto, null);
    }

    @PutMapping("/{id}")
    public Transaction update(@PathVariable Long id, @RequestBody @Valid TransactionDTO dto) {
        return service.saveDTO(dto, id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
