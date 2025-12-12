package com.wealthOrchestrator.backend.dto;

public class MonthlyTrendsDTO {

    private String month;
    private double income;
    private double expense;

    public MonthlyTrendsDTO(String month, double income, double expense) {
        this.month = month;
        this.income = income;
        this.expense = expense;
    }

    public String getMonth() { return month; }
    public double getIncome() { return income; }
    public double getExpense() { return expense; }
}

