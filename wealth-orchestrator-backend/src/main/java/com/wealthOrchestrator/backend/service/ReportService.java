package com.wealthOrchestrator.backend.service;

import com.wealthOrchestrator.backend.dto.CategoryReportDTO;
import com.wealthOrchestrator.backend.dto.ReportDTO;
import com.wealthOrchestrator.backend.model.Transaction;
import com.wealthOrchestrator.backend.model.User;
import com.wealthOrchestrator.backend.repository.TransactionRepository;
import com.wealthOrchestrator.backend.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final TransactionRepository repo;
    private final UserRepository userRepo;

    public ReportService(TransactionRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    private User getLoggedUser() {
        UserDetails userDetails =
                (UserDetails) SecurityContextHolder.getContext()
                        .getAuthentication().getPrincipal();

        return userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow();
    }

    // 🔹 Summary Report (User-specific)
    public Map<String, Double> getSummary() {
        List<Transaction> txns = repo.findByUser(getLoggedUser());
        int currentMonth = java.time.LocalDate.now().getMonthValue();
        int currentYear = java.time.LocalDate.now().getYear();

        double income = txns.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .mapToDouble(t -> t.getAmount().doubleValue())
                .sum();

        double expense = txns.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .mapToDouble(t -> t.getAmount().doubleValue())
                .sum();

        double thisMonthExpense = txns.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .filter(t -> t.getDate() != null)
                .filter(t -> t.getDate().getMonthValue() == currentMonth &&
                             t.getDate().getYear() == currentYear)
                .mapToDouble(t -> t.getAmount().doubleValue())
                .sum();

        Map<String, Double> summary = new HashMap<>();
        summary.put("totalIncome", income);
        summary.put("totalExpense", expense);
        summary.put("totalBalance", income - expense);
        summary.put("thisMonthExpense", thisMonthExpense);

        return summary;
    }

    // 🔹 Monthly Trends (User-specific)
    public List<ReportDTO> getTrends() {
        List<Transaction> txns = repo.findByUser(getLoggedUser());
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");

        Map<String, ReportDTO> grouped = new LinkedHashMap<>();

        txns.stream()
                .filter(t -> t.getDate() != null)
                .forEach(t -> {
                    String month = t.getDate().format(fmt);
                    grouped.putIfAbsent(month, new ReportDTO(month, 0.0, 0.0));

                    ReportDTO r = grouped.get(month);
                    if ("INCOME".equalsIgnoreCase(t.getType())) {
                        r.setIncome(r.getIncome() + t.getAmount().doubleValue());
                    } else {
                        r.setExpense(r.getExpense() + t.getAmount().doubleValue());
                    }
                });

        return new ArrayList<>(grouped.values());
    }

    // 🔹 Category Breakdown (User-specific)
    public List<CategoryReportDTO> getCategories() {
        List<Transaction> txns = repo.findByUser(getLoggedUser());

        return txns.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .collect(Collectors.groupingBy(
                        t -> Optional.ofNullable(t.getCategory()).orElse("Others"),
                        Collectors.summingDouble(t -> t.getAmount().doubleValue())
                ))
                .entrySet()
                .stream()
                .map(e -> new CategoryReportDTO(e.getKey(), e.getValue()))
                .sorted((a, b) -> Double.compare(b.getTotal(), a.getTotal()))
                .collect(Collectors.toList());
    }
}
