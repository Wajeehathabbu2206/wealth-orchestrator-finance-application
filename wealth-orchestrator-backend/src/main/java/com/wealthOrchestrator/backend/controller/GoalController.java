package com.wealthOrchestrator.backend.controller;

import com.wealthOrchestrator.backend.dto.GoalDTO;
import com.wealthOrchestrator.backend.model.Goal;
import com.wealthOrchestrator.backend.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    private final GoalService service;

    public GoalController(GoalService service) {
        this.service = service;
    }

    @GetMapping
    public List<Goal> getAll() {
        return service.getAllGoals();
    }

    @PostMapping
    public Goal create(@Valid @RequestBody GoalDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public Goal update(@PathVariable Long id, @Valid @RequestBody GoalDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
