package com.wealthOrchestrator.backend.dto;

public class AIInsightDTO {

    private String type;       // e.g. "SPENDING", "BUDGET", "GOAL"
    private String title;      // short heading
    private String message;    // detailed text
    private String category;   // e.g. "Food", "Rent", "Goals"
    private String severity;   // "LOW", "MEDIUM", "HIGH"

    public AIInsightDTO() {}

    public AIInsightDTO(String type, String title, String message, String category, String severity) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.category = category;
        this.severity = severity;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
