package com.wealthOrchestrator.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class BudgetDTO {

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Limit amount is required")
    @DecimalMin(value = "1.00", message = "Limit must be > 0")
    private BigDecimal limitAmount;

    @NotNull(message = "Month is required")
    private LocalDate month;

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getLimitAmount() { return limitAmount; }
    public void setLimitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; }

    public LocalDate getMonth() { return month; }
    public void setMonth(LocalDate month) { this.month = month; }
}
