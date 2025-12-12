package com.wealthOrchestrator.backend.dto;

public class ReportDTO {

    private String month;
    private Double income;
    private Double expense;

    public ReportDTO(String month, Double income, Double expense) {
        this.month = month;
        this.income = income;
        this.expense = expense;
    }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public Double getIncome() { return income; }
    public void setIncome(Double income) { this.income = income; }

    public Double getExpense() { return expense; }
    public void setExpense(Double expense) { this.expense = expense; }
}
