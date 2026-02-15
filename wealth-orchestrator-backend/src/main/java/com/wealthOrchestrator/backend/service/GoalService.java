package com.wealthOrchestrator.backend.service;

import com.wealthOrchestrator.backend.dto.GoalDTO;
import com.wealthOrchestrator.backend.model.Goal;
import com.wealthOrchestrator.backend.model.User;
import com.wealthOrchestrator.backend.model.Transaction;
import com.wealthOrchestrator.backend.repository.GoalRepository;
import com.wealthOrchestrator.backend.repository.TransactionRepository;
import com.wealthOrchestrator.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    private final GoalRepository goalRepo;
    private final TransactionRepository transactionRepo;
    private final UserRepository userRepo;

    public GoalService(GoalRepository goalRepo,
                       TransactionRepository transactionRepo,
                       UserRepository userRepo) {
        this.goalRepo = goalRepo;
        this.transactionRepo = transactionRepo;
        this.userRepo = userRepo;
    }

    private User getLoggedUser() {
        UserDetails userDetails =
                (UserDetails) SecurityContextHolder.getContext()
                        .getAuthentication().getPrincipal();

        return userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow();
    }

    public List<Goal> getAllGoals() {
        return goalRepo.findByUser(getLoggedUser());
    }

    public Optional<Goal> getGoal(Long id) {
        return goalRepo.findById(id)
                .filter(g -> g.getUser().equals(getLoggedUser()));
    }

    public Goal create(GoalDTO dto) {
        Goal goal = new Goal(dto.getTitle(), dto.getTargetAmount(), dto.getDeadline());
        goal.setUser(getLoggedUser());

        // compute savedAmount from existing transactions
        refreshGoal(goal, getLoggedUser());
        return goalRepo.save(goal);
    }

    public Goal update(Long id, GoalDTO dto) {
        Goal goal = getGoal(id).orElseThrow();

        goal.setTitle(dto.getTitle());
        goal.setTargetAmount(dto.getTargetAmount());
        goal.setDeadline(dto.getDeadline());

        // recompute saved amount based on user's transactions
        refreshGoal(goal, getLoggedUser());
        return goalRepo.save(goal);
    }

    public void delete(Long id) {
        getGoal(id).ifPresent(goalRepo::delete);
    }

    /**
     * Recalculate savedAmount and status for a single goal using the provided user's transactions.
     * This method is public so TransactionService can call it after transaction changes.
     */
    public void refreshGoal(Goal goal, User user) {
        // collect transactions for the user
        List<Transaction> transactions = transactionRepo.findByUser(user);

        BigDecimal income = transactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expense = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saved = income.subtract(expense);
        goal.setSavedAmount(saved);

        goal.setStatus(saved.compareTo(goal.getTargetAmount()) >= 0
                ? Goal.Status.COMPLETED
                : Goal.Status.ONGOING);
    }

    /**
     * Recalculate & persist all goals for a given user.
     * TransactionService will call this after any transaction create/update/delete.
     */
    public void refreshGoalsForUser(User user) {
        List<Goal> goals = goalRepo.findByUser(user);
        for (Goal g : goals) {
            refreshGoal(g, user);
            goalRepo.save(g);
        }
    }
}
