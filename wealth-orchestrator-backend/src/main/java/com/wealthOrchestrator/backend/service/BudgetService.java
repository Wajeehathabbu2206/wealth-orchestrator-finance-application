package com.wealthOrchestrator.backend.service;

import com.wealthOrchestrator.backend.dto.BudgetDTO;
import com.wealthOrchestrator.backend.model.Budget;
import com.wealthOrchestrator.backend.model.Transaction;
import com.wealthOrchestrator.backend.model.User;
import com.wealthOrchestrator.backend.repository.BudgetRepository;
import com.wealthOrchestrator.backend.repository.TransactionRepository;
import com.wealthOrchestrator.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepo;
    private final TransactionRepository transactionRepo;
    private final UserRepository userRepo;

    public BudgetService(BudgetRepository budgetRepo,
                         TransactionRepository transactionRepo,
                         UserRepository userRepo) {
        this.budgetRepo = budgetRepo;
        this.transactionRepo = transactionRepo;
        this.userRepo = userRepo;
    }

    // Get logged user
    private User getLoggedUser() {
        Object principal = SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        String username = (principal instanceof UserDetails ud)
                ? ud.getUsername()
                : principal.toString();

        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    // ------------------- CRUD -------------------

    public List<Budget> getAllBudgets() {
        return budgetRepo.findByUser(getLoggedUser());
    }

    public Optional<Budget> getBudget(Long id) {
        return budgetRepo.findById(id)
                .filter(b -> b.getUser().getId().equals(getLoggedUser().getId()));
    }

    public Budget save(BudgetDTO dto) {
        Budget budget = new Budget(dto.getCategory(), dto.getLimitAmount(), dto.getMonth());
        budget.setUser(getLoggedUser());

        recalculateSpentAmount(budget);
        return budgetRepo.save(budget);
    }

    public Budget update(Long id, BudgetDTO dto) {
        Budget budget = getBudget(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        budget.setCategory(dto.getCategory());
        budget.setLimitAmount(dto.getLimitAmount());
        budget.setMonth(dto.getMonth());

        recalculateSpentAmount(budget);
        return budgetRepo.save(budget);
    }

    public void delete(Long id) {
        getBudget(id).ifPresent(budgetRepo::delete);
    }

    // ------------------- 🔥 Monthly Budget Recalculation -------------------

    public void recalculateSpentAmount(Budget budget) {

        if (budget.getCategory() == null || budget.getMonth() == null) {
            budget.setSpentAmount(BigDecimal.ZERO);
            return;
        }

        User user = budget.getUser();
        List<Transaction> transactions = transactionRepo.findByUser(user);

        int budgetYear = budget.getMonth().getYear();
        int budgetMonth = budget.getMonth().getMonthValue();

        BigDecimal total = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .filter(t -> t.getCategory() != null &&
                             t.getCategory().equalsIgnoreCase(budget.getCategory()))
                .filter(t -> t.getDate() != null &&
                             t.getDate().getYear() == budgetYear &&
                             t.getDate().getMonthValue() == budgetMonth)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        budget.setSpentAmount(total);
    }
}
