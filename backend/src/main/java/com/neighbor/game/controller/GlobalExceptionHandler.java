package com.neighbor.game.controller;

import com.neighbor.game.service.LevelNotFoundException;
import com.neighbor.game.service.LevelNotUnlockedException;
import com.neighbor.game.service.PlayerNotFoundException;
import com.neighbor.game.service.PrankNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PlayerNotFoundException.class)
    public ProblemDetail handlePlayerNotFound(PlayerNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(PrankNotFoundException.class)
    public ProblemDetail handlePrankNotFound(PrankNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(LevelNotFoundException.class)
    public ProblemDetail handleLevelNotFound(LevelNotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(LevelNotUnlockedException.class)
    public ProblemDetail handleLevelNotUnlocked(LevelNotUnlockedException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleBadRequest(IllegalArgumentException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, ex.getMessage());
    }
}
