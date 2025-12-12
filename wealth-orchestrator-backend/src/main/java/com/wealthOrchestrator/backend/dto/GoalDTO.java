package com.wealthOrchestrator.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class GoalDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Target amount is required")
    @DecimalMin(value = "1.00", message = "Target must be > 0")
    private BigDecimal targetAmount;

    @NotNull(message = "Deadline is required")
    private LocalDate deadline;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getTargetAmount() { return targetAmount; }
    public void setTargetAmount(BigDecimal targetAmount) { this.targetAmount = targetAmount; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
}
