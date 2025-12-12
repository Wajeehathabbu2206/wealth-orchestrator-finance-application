package com.wealthOrchestrator.backend.dto;

public class CategoryReportDTO {

    private String category;
    private Double total;

    public CategoryReportDTO(String category, Double total) {
        this.category = category;
        this.total = total;
    }

    public String getCategory() { return category; }
    public Double getTotal() { return total; }

}
