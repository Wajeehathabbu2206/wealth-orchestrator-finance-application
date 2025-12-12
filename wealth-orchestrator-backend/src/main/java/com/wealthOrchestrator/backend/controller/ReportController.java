package com.wealthOrchestrator.backend.controller;

import com.wealthOrchestrator.backend.dto.CategoryReportDTO;
import com.wealthOrchestrator.backend.dto.ReportDTO;
import com.wealthOrchestrator.backend.service.ReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService service;

    public ReportController(ReportService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public Map<String, Double> getSummary() {
        return service.getSummary();
    }

    @GetMapping("/trends")
    public List<ReportDTO> getTrends() {
        return service.getTrends();
    }

    @GetMapping("/categories")
    public List<CategoryReportDTO> getCategories() {
        return service.getCategories();
    }
}
