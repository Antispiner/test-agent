package com.neighbor.game.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "player_progress")
public class PlayerProgress {

    @Id
    private String playerId;

    @Column(name = "current_level_id")
    private Long currentLevelId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "player_completed_levels", joinColumns = @JoinColumn(name = "player_id"))
    @Column(name = "level_id")
    private Set<Long> completedLevelIds = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "player_executed_pranks", joinColumns = @JoinColumn(name = "player_id"))
    @Column(name = "prank_id")
    private Set<Long> executedPrankIds = new HashSet<>();

    @Column(name = "current_anger")
    private int currentAnger;

    @Column(name = "total_score")
    private int totalScore;

    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }
    public Long getCurrentLevelId() { return currentLevelId; }
    public void setCurrentLevelId(Long currentLevelId) { this.currentLevelId = currentLevelId; }
    public Set<Long> getCompletedLevelIds() { return completedLevelIds; }
    public void setCompletedLevelIds(Set<Long> completedLevelIds) { this.completedLevelIds = completedLevelIds; }
    public Set<Long> getExecutedPrankIds() { return executedPrankIds; }
    public void setExecutedPrankIds(Set<Long> executedPrankIds) { this.executedPrankIds = executedPrankIds; }
    public int getCurrentAnger() { return currentAnger; }
    public void setCurrentAnger(int currentAnger) { this.currentAnger = currentAnger; }
    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
}
