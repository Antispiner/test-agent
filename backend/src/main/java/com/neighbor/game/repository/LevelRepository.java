package com.neighbor.game.repository;

import com.neighbor.game.model.Level;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LevelRepository extends JpaRepository<Level, Long> {
    List<Level> findAllByOrderByOrderIndexAsc();

    Optional<Level> findByOrderIndex(int orderIndex);

    Optional<Level> findFirstByOrderIndexGreaterThanOrderByOrderIndexAsc(int orderIndex);
}
