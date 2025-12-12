package com.wealthOrchestrator.backend.controller;

import com.wealthOrchestrator.backend.dto.AIInsightDTO;
import com.wealthOrchestrator.backend.service.AIInsightService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIInsightController {

    private final AIInsightService service;

    public AIInsightController(AIInsightService service) {
        this.service = service;
    }

    @GetMapping("/insights")
    public List<AIInsightDTO> getInsights() {
        return service.getInsights();
    }
}
