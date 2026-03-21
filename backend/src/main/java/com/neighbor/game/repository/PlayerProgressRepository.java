package com.neighbor.game.repository;

import com.neighbor.game.model.PlayerProgress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerProgressRepository extends JpaRepository<PlayerProgress, String> {
}
