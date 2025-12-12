package com.wealthOrchestrator.backend.repository;

import com.wealthOrchestrator.backend.model.Transaction;
import com.wealthOrchestrator.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type='INCOME'")
    Double getTotalIncome(User user);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type='EXPENSE'")
    Double getTotalExpense(User user);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.type='EXPENSE' AND MONTH(t.date)=MONTH(CURRENT_DATE)")
    Double getThisMonthExpense(User user);

    @Query("SELECT MONTH(t.date), " +
           "SUM(CASE WHEN t.type='INCOME' THEN t.amount ELSE 0 END), " +
           "SUM(CASE WHEN t.type='EXPENSE' THEN t.amount ELSE 0 END) " +
           "FROM Transaction t WHERE t.user = :user AND t.date >= :startDate " +
           "GROUP BY MONTH(t.date) ORDER BY MONTH(t.date)")
    List<Object[]> getMonthlyTrends(User user, LocalDate startDate);

    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t " +
           "WHERE t.user = :user AND t.type='EXPENSE' " +
           "GROUP BY t.category")
    List<Object[]> getExpenseByCategory(User user);
}
