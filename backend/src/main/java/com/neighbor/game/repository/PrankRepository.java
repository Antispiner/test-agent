package com.neighbor.game.repository;

import com.neighbor.game.model.Prank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrankRepository extends JpaRepository<Prank, Long> {
}
