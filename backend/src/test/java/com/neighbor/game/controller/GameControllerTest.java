package com.neighbor.game.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void startGame_returnsPlayerIdAndInitialState() throws Exception {
        mockMvc.perform(post("/api/game/start"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerId").isNotEmpty())
                .andExpect(jsonPath("$.currentLevelId").value(1))
                .andExpect(jsonPath("$.totalScore").value(0))
                .andExpect(jsonPath("$.completedLevelIds").isEmpty());
    }

    @Test
    void getProgress_returnsProgress() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game/start"))
                .andReturn();
        String playerId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("playerId").asText();

        mockMvc.perform(get("/api/game/{playerId}", playerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.playerId").value(playerId))
                .andExpect(jsonPath("$.currentLevelId").value(1));
    }

    @Test
    void getProgress_unknownPlayer_returns404() throws Exception {
        mockMvc.perform(get("/api/game/nonexistent"))
                .andExpect(status().isNotFound());
    }

    @Test
    void resetProgress_returns204() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game/start"))
                .andReturn();
        String playerId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("playerId").asText();

        mockMvc.perform(delete("/api/game/{playerId}", playerId))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/game/{playerId}", playerId))
                .andExpect(status().isNotFound());
    }

    @Test
    void executePrank_independentPrank_succeeds() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game/start"))
                .andReturn();
        String playerId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("playerId").asText();

        // Prank 4 (Rewire Toaster) has no dependencies and 90% success chance
        mockMvc.perform(post("/api/game/{playerId}/levels/1/pranks/4/execute", playerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.prankId").value(4));
    }

    @Test
    void executePrank_alreadyExecuted_returnsFalse() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game/start"))
                .andReturn();
        String playerId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("playerId").asText();

        // Execute prank 4 until it succeeds (90% chance)
        boolean succeeded = false;
        for (int i = 0; i < 20 && !succeeded; i++) {
            MvcResult prankResult = mockMvc.perform(
                    post("/api/game/{playerId}/levels/1/pranks/4/execute", playerId))
                    .andReturn();
            JsonNode node = objectMapper.readTree(prankResult.getResponse().getContentAsString());
            succeeded = node.get("success").asBoolean();
        }

        if (succeeded) {
            // Now try again — should say already executed
            mockMvc.perform(post("/api/game/{playerId}/levels/1/pranks/4/execute", playerId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value(containsString("Already executed")));
        }
    }

    @Test
    void executePrank_missingDependency_returnsFalse() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game/start"))
                .andReturn();
        String playerId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("playerId").asText();

        // Prank 3 (Grease Floor) requires prank 1 (Salt Swap) first
        mockMvc.perform(post("/api/game/{playerId}/levels/1/pranks/3/execute", playerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(containsString("something else first")));
    }

    @Test
    void executePrank_wrongLevel_returns400() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game/start"))
                .andReturn();
        String playerId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("playerId").asText();

        // Prank 1 belongs to level 1, not level 2
        mockMvc.perform(post("/api/game/{playerId}/levels/2/pranks/1/execute", playerId))
                .andExpect(status().isBadRequest());
    }

    @Test
    void executePrank_unknownPrank_returns404() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game/start"))
                .andReturn();
        String playerId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("playerId").asText();

        mockMvc.perform(post("/api/game/{playerId}/levels/1/pranks/999/execute", playerId))
                .andExpect(status().isNotFound());
    }
}
