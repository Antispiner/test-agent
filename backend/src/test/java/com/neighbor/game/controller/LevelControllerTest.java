package com.neighbor.game.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class LevelControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String createPlayer() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game/start"))
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString())
                .get("playerId").asText();
    }

    @Test
    void listLevels_returns3Levels() throws Exception {
        String playerId = createPlayer();

        mockMvc.perform(get("/api/levels").param("playerId", playerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].name").value("Kitchen"))
                .andExpect(jsonPath("$[1].name").value("Bathroom"))
                .andExpect(jsonPath("$[2].name").value("Living Room"));
    }

    @Test
    void listLevels_firstLevelUnlocked() throws Exception {
        String playerId = createPlayer();

        mockMvc.perform(get("/api/levels").param("playerId", playerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].unlocked").value(true))
                .andExpect(jsonPath("$[0].completed").value(false))
                .andExpect(jsonPath("$[0].maxAnger").value(100));
    }

    @Test
    void getLevel_returnsLevelWithPranks() throws Exception {
        String playerId = createPlayer();

        mockMvc.perform(get("/api/levels/1").param("playerId", playerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Kitchen"))
                .andExpect(jsonPath("$.pranks", hasSize(5)))
                .andExpect(jsonPath("$.pranks[?(@.name == 'Swap Salt and Sugar')]").exists());
    }

    @Test
    void getLevel_unknownPlayer_returns404() throws Exception {
        mockMvc.perform(get("/api/levels").param("playerId", "nonexistent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getLevel_unknownLevel_returns404() throws Exception {
        String playerId = createPlayer();

        mockMvc.perform(get("/api/levels/99").param("playerId", playerId))
                .andExpect(status().isNotFound());
    }

    @Test
    void getLevel_prankDependenciesReflectedInAvailability() throws Exception {
        String playerId = createPlayer();

        mockMvc.perform(get("/api/levels/1").param("playerId", playerId))
                .andExpect(status().isOk())
                // Prank "Swap Salt and Sugar" (id=1) has no deps -> available
                .andExpect(jsonPath("$.pranks[?(@.id == 1)].available").value(hasItem(true)))
                // Prank "Grease the Floor" (id=3) requires prank 1 -> not available yet
                .andExpect(jsonPath("$.pranks[?(@.id == 3)].available").value(hasItem(false)));
    }
}
