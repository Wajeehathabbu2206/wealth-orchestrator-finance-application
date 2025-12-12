package com.wealthOrchestrator.backend.repository;

import com.wealthOrchestrator.backend.model.Budget;
import com.wealthOrchestrator.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUser(User user);

    List<Budget> findByUserAndCategoryIgnoreCase(User user, String category);
}
