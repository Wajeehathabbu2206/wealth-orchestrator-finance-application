package com.wealthOrchestrator.backend.service;

import com.wealthOrchestrator.backend.dto.TransactionDTO;
import com.wealthOrchestrator.backend.model.Budget;
import com.wealthOrchestrator.backend.model.Transaction;
import com.wealthOrchestrator.backend.model.User;
import com.wealthOrchestrator.backend.repository.BudgetRepository;
import com.wealthOrchestrator.backend.repository.TransactionRepository;
import com.wealthOrchestrator.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * TransactionService
 *
 * Responsibilities:
 *  - Create / Update / Delete transactions (owned by logged user)
 *  - After create/update/delete: refresh budgets (category-based) and goals (user-based)
 *
 * Note: This service uses BudgetService and GoalService to recalculate spent & saved values.
 */
@Service
public class TransactionService {

    private final BudgetService budgetService;
    private final BudgetRepository budgetRepo;
    private final TransactionRepository repo;
    private final UserRepository userRepo;
    private final GoalService goalService;

    public TransactionService(TransactionRepository repo,
                              UserRepository userRepo,
                              BudgetRepository budgetRepo,
                              BudgetService budgetService,
                              GoalService goalService) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.budgetRepo = budgetRepo;
        this.budgetService = budgetService;
        this.goalService = goalService;
    }

    private User getLoggedUser() {
        UserDetails userDetails = (UserDetails)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow();
    }

    public List<Transaction> getAll() {
        return repo.findByUser(getLoggedUser());
    }

    public Optional<Transaction> getById(Long id) {
        return repo.findById(id)
                .filter(t -> t.getUser().equals(getLoggedUser()));
    }

    /**
     * Delete a transaction (only if owned by logged user).
     * After deletion we refresh budgets for the transaction's category and refresh goals for the user.
     */
    public void delete(Long id) {
        Optional<Transaction> maybe = getById(id);
        maybe.ifPresent(tx -> {
            User owner = tx.getUser();
            // delete first
            repo.delete(tx);

            // After delete, recalculate budgets and goals (they read transactions from DB)
            if (tx.getCategory() != null) {
                refreshBudgetsForCategory(owner, tx.getCategory());
            }
            goalService.refreshGoalsForUser(owner);
        });
    }

    /**
     * Create or update transaction from DTO.
     * If updating, we detect the previous transaction (old) to refresh both old and new categories.
     */
    public Transaction saveDTO(TransactionDTO dto, Long id) {
        User user = getLoggedUser();

        // load existing for update (if present)
        Optional<Transaction> existingOpt = (id != null) ? repo.findById(id) : Optional.empty();
        String oldCategory = null;
        String oldType = null;

        if (existingOpt.isPresent()) {
            Transaction old = existingOpt.get();
            // ensure ownership
            if (!old.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Not authorized to modify this transaction");
            }
            oldCategory = old.getCategory();
            oldType = old.getType();
        }

        Transaction transaction = (existingOpt.isPresent()) ? existingOpt.get() : new Transaction();

        // set fields
        transaction.setTitle(dto.getTitle());
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setDate(dto.getDate());
        transaction.setCategory(dto.getCategory());
        transaction.setNotes(dto.getNotes());
        transaction.setUser(user);

        // Save (create or update)
        Transaction saved = repo.save(transaction);

        // --- Refresh budgets ---
        // Refresh any budgets linked to the new category
        if (saved.getCategory() != null) {
            refreshBudgetsForCategory(user, saved.getCategory());
        }
        // If category changed during update, refresh budgets for the old category too
        if (oldCategory != null && !oldCategory.equalsIgnoreCase(saved.getCategory())) {
            refreshBudgetsForCategory(user, oldCategory);
        }

        // --- Refresh goals for user (goals are computed from all transactions for that user) ---
        // Calling this ensures savedAmount/status is recalculated (handles income/expense changes)
        goalService.refreshGoalsForUser(user);

        return saved;
    }

    /**
     * Helper: find budgets of the user with given category (case-insensitive) and recalculate each.
     */
    private void refreshBudgetsForCategory(User user, String category) {
        if (category == null || category.isBlank()) return;

        List<Budget> relatedBudgets =
                budgetRepo.findByUserAndCategoryIgnoreCase(user, category);

        for (Budget budget : relatedBudgets) {
            // ask BudgetService to recalculate spentAmount based on transactions in DB
            budgetService.recalculateSpentAmount(budget);
            // persist updated budget
            budgetRepo.save(budget);
        }
    }
}
