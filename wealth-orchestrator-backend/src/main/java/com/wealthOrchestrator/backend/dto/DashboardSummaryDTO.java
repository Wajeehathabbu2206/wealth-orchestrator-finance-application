package com.wealthOrchestrator.backend.dto;

public class DashboardSummaryDTO {

    private double totalIncome;
    private double totalExpense;
    private double totalBalance;
    private double thisMonthExpense;

    public DashboardSummaryDTO() {}

    public DashboardSummaryDTO(double totalIncome, double totalExpense, double thisMonthExpense) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.totalBalance = totalIncome - totalExpense;
        this.thisMonthExpense = thisMonthExpense;
    }

    public double getTotalIncome() { return totalIncome; }
    public double getTotalExpense() { return totalExpense; }
    public double getTotalBalance() { return totalBalance; }
    public double getThisMonthExpense() { return thisMonthExpense; }
}

