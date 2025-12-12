package com.wealthOrchestrator.backend.dto;

public class CategoryExpenseDTO {
    private String category;
    private double amount;

    public CategoryExpenseDTO(String category, double amount) {
        this.category = category;
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public double getAmount() {
        return amount;
    }
}

