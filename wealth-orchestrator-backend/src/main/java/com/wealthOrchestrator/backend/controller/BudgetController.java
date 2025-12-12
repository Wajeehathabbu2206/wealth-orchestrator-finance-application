package com.wealthOrchestrator.backend.controller;

import com.wealthOrchestrator.backend.dto.BudgetDTO;
import com.wealthOrchestrator.backend.model.Budget;
import com.wealthOrchestrator.backend.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetService service;

    public BudgetController(BudgetService service) {
        this.service = service;
    }

    @GetMapping
    public List<Budget> getAllBudgets() {
        return service.getAllBudgets();
    }

    @GetMapping("/{id}")
    public Optional<Budget> getBudget(@PathVariable Long id) {
        return service.getBudget(id);
    }

    @PostMapping
    public Budget addBudget(@Valid @RequestBody BudgetDTO dto) {
        return service.save(dto);
    }

    @PutMapping("/{id}")
    public Budget updateBudget(@PathVariable Long id,
                               @Valid @RequestBody BudgetDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id) {
        service.delete(id);
    }
}
