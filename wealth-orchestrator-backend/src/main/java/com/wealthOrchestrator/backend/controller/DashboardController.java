package com.wealthOrchestrator.backend.controller;

import com.wealthOrchestrator.backend.dto.CategoryExpenseDTO;
import com.wealthOrchestrator.backend.dto.DashboardSummaryDTO;
import com.wealthOrchestrator.backend.dto.MonthlyTrendsDTO;
import com.wealthOrchestrator.backend.service.DashboardService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public DashboardSummaryDTO getSummary() {
        return service.getDashboardSummary();
    }

    @GetMapping("/trends")
    public List<MonthlyTrendsDTO> getTrends() {
        return service.getMonthlyTrends();
    }

    @GetMapping("/categories")
    public List<CategoryExpenseDTO> getCategoryExpenses() {
        return service.getCategoryExpenses();
    }
}
