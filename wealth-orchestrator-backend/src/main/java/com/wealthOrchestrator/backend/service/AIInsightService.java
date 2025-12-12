package com.wealthOrchestrator.backend.service;

import com.wealthOrchestrator.backend.dto.AIInsightDTO;
import com.wealthOrchestrator.backend.model.*;
import com.wealthOrchestrator.backend.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIInsightService {

    private final TransactionRepository transactionRepo;
    private final BudgetRepository budgetRepo;
    private final GoalRepository goalRepo;
    private final UserRepository userRepo;

    public AIInsightService(TransactionRepository transactionRepo,
                            BudgetRepository budgetRepo,
                            GoalRepository goalRepo,
                            UserRepository userRepo) {
        this.transactionRepo = transactionRepo;
        this.budgetRepo = budgetRepo;
        this.goalRepo = goalRepo;
        this.userRepo = userRepo;
    }

    private User getLoggedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = principal instanceof UserDetails
                ? ((UserDetails) principal).getUsername()
                : principal.toString();

        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public List<AIInsightDTO> getInsights() {
        List<AIInsightDTO> insights = new ArrayList<>();
        User user = getLoggedUser();

        getTopSpendingCategory(user).ifPresent(insights::add);
        getBudgetRiskInsight(user).ifPresent(insights::add);
        getGoalProgressInsight(user).ifPresent(insights::add);

        // Always fill minimum 3 cards
        if (insights.size() < 3) {
            insights.addAll(getFallbackInsights(3 - insights.size()));
        }

        return insights;
    }

    // 🔹 Insight: Top Spending Category (last 30 days)
    private Optional<AIInsightDTO> getTopSpendingCategory(User user) {
        LocalDate fromDate = LocalDate.now().minusDays(30);

        Map<String, BigDecimal> totals = transactionRepo.findByUser(user).stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .filter(t -> t.getDate() != null && !t.getDate().isBefore(fromDate))
                .collect(Collectors.groupingBy(
                        t -> Optional.ofNullable(t.getCategory()).orElse("Others"),
                        Collectors.mapping(
                                Transaction::getAmount,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));

        if (totals.isEmpty()) return Optional.empty();

        var top = totals.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        if (top == null || top.getValue().compareTo(BigDecimal.ZERO) <= 0) return Optional.empty();

        return Optional.of(new AIInsightDTO(
                "SPENDING",
                "Top Spending: " + top.getKey(),
                String.format("₹%.0f spent on %s in the last 30 days.",
                        top.getValue().doubleValue(), top.getKey()),
                top.getKey(),
                "MEDIUM"
        ));
    }

    // 🔹 Insight: High Budget Usage
    private Optional<AIInsightDTO> getBudgetRiskInsight(User user) {
        List<Budget> budgets = budgetRepo.findByUser(user);
        if (budgets.isEmpty()) return Optional.empty();

        Budget risky = budgets.stream()
                .filter(b -> b.getLimitAmount() != null
                        && b.getLimitAmount().compareTo(BigDecimal.ZERO) > 0)
                .max(Comparator.comparing(b ->
                        b.getSpentAmount().divide(b.getLimitAmount(), 2, BigDecimal.ROUND_HALF_UP)))
                .orElse(null);

        if (risky == null || risky.getSpentAmount() == null) return Optional.empty();

        double percent = risky.getSpentAmount()
                .divide(risky.getLimitAmount(), 2, BigDecimal.ROUND_HALF_UP)
                .doubleValue() * 100;

        if (percent < 60) return Optional.empty(); // Only show meaningful alerts

        return Optional.of(new AIInsightDTO(
                "BUDGET",
                "⚠ " + risky.getCategory() + " Budget Nearly Used",
                String.format("%.0f%% of %s budget used already!",
                        percent, risky.getCategory()),
                risky.getCategory(),
                percent >= 90 ? "HIGH" : "MEDIUM"
        ));
    }

    // 🔹 Insight: Best Goal Progress
    private Optional<AIInsightDTO> getGoalProgressInsight(User user) {
        List<Goal> goals = goalRepo.findByUser(user);
        if (goals.isEmpty()) return Optional.empty();

        // Pick goal with highest progress ratio
        Goal top = goals.stream()
                .filter(g -> g.getTargetAmount() != null
                        && g.getTargetAmount().compareTo(BigDecimal.ZERO) > 0)
                .max(Comparator.comparing(g ->
                        g.getSavedAmount()
                                .divide(g.getTargetAmount(), 4, BigDecimal.ROUND_HALF_UP)))
                .orElse(null);

        if (top == null || top.getSavedAmount() == null) return Optional.empty();

        BigDecimal saved = top.getSavedAmount();
        BigDecimal target = top.getTargetAmount();

        // Handle goal achieved condition
        boolean achieved = saved.compareTo(target) >= 0;

        // Calculate percentage safely
        double percent = saved
                .divide(target, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();

        String message;
        String severity;

        if (achieved) {
            message = "Goal achieved!";
            severity = "SUCCESS";  // you can return HIGH/MEDIUM if required
        } else {
            message = String.format(
                    "You've achieved %.0f%% of '%s'. Keep going!",
                    percent, top.getTitle()
            );
            severity = percent >= 80 ? "HIGH" : "MEDIUM";
        }

        return Optional.of(
                new AIInsightDTO(
                        "GOAL",
                        "Goal Progress: " + top.getTitle(),
                        message,
                        top.getTitle(),
                        severity
                )
        );
    }


    // 🔹 Fallback Tips (Ensures Min. 3 Cards)
    private List<AIInsightDTO> getFallbackInsights(int count) {
        List<String> messages = List.of(
                "Track expenses often — knowledge is power! 💰",
                "Try setting a budget — it keeps spending in control.",
                "Monitor weekly activity to avoid surprises later.",
                "Avoid impulsive purchases — wait 24 hours before buying!",
                "Aim to save 20% of income every month!"
        );

        List<AIInsightDTO> fallback = new ArrayList<>();
        for (int i = 0; i < count && i < messages.size(); i++) {
            fallback.add(new AIInsightDTO(
                    "GENERAL",
                    "Smart Finance Tip 💡",
                    messages.get(i),
                    null,
                    "LOW"
            ));
        }
        return fallback;
    }
}
