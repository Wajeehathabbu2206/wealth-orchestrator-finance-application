package com.wealthOrchestrator.backend.service;

import com.wealthOrchestrator.backend.dto.CategoryExpenseDTO;
import com.wealthOrchestrator.backend.dto.DashboardSummaryDTO;
import com.wealthOrchestrator.backend.dto.MonthlyTrendsDTO;
import com.wealthOrchestrator.backend.model.User;
import com.wealthOrchestrator.backend.repository.TransactionRepository;
import com.wealthOrchestrator.backend.repository.UserRepository;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepo;

    public DashboardService(TransactionRepository transactionRepository, UserRepository userRepo) {
        this.transactionRepository = transactionRepository;
        this.userRepo = userRepo;
    }

    private User getLoggedUser() {
        UserDetails userDetails =
                (UserDetails) SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        return userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow();
    }

    public DashboardSummaryDTO getDashboardSummary() {
        User user = getLoggedUser();

        Double totalIncome = transactionRepository.getTotalIncome(user);
        Double totalExpense = transactionRepository.getTotalExpense(user);
        Double thisMonthExpense = transactionRepository.getThisMonthExpense(user);

        if (totalIncome == null) totalIncome = 0.0;
        if (totalExpense == null) totalExpense = 0.0;
        if (thisMonthExpense == null) thisMonthExpense = 0.0;

        return new DashboardSummaryDTO(totalIncome, totalExpense, thisMonthExpense);
    }

    public List<MonthlyTrendsDTO> getMonthlyTrends() {
        User user = getLoggedUser();
        LocalDate startDate = LocalDate.now().minusMonths(6);

        List<Object[]> results = transactionRepository.getMonthlyTrends(user, startDate);
        List<MonthlyTrendsDTO> trends = new ArrayList<>();

        for (Object[] row : results) {
            int monthNumber = ((Number) row[0]).intValue();
            double income = ((Number) row[1]).doubleValue();
            double expense = ((Number) row[2]).doubleValue();
            String monthName = Month.of(monthNumber).name().substring(0, 3);
            trends.add(new MonthlyTrendsDTO(monthName, income, expense));
        }

        return trends;
    }

    public List<CategoryExpenseDTO> getCategoryExpenses() {
        User user = getLoggedUser();
        List<Object[]> rows = transactionRepository.getExpenseByCategory(user);

        List<CategoryExpenseDTO> categories = new ArrayList<>();
        for (Object[] row : rows) {
            categories.add(
                new CategoryExpenseDTO(
                    (String) row[0],
                    ((Number) row[1]).doubleValue()
                )
            );
        }

        return categories;
    }
}
