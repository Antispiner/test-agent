package com.tictactoe.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tictactoe.dto.MoveRequest;
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

@SpringBootTest
@AutoConfigureMockMvc
class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createGame_returns201WithNewGame() throws Exception {
        mockMvc.perform(post("/api/game"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.currentPlayer").value("X"))
                .andExpect(jsonPath("$.status").value("in_progress"))
                .andExpect(jsonPath("$.board").isArray())
                .andExpect(jsonPath("$.board[0]").isArray());
    }

    @Test
    void getGame_returnsExistingGame() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game"))
                .andReturn();
        String id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();

        mockMvc.perform(get("/api/game/" + id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id));
    }

    @Test
    void getGame_returns404ForUnknownId() throws Exception {
        mockMvc.perform(get("/api/game/nonexistent"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Game not found"));
    }

    @Test
    void makeMove_placesMarkSuccessfully() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game"))
                .andReturn();
        String id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();

        mockMvc.perform(post("/api/game/" + id + "/move")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new MoveRequest(0, 0))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.board[0][0]").value("X"))
                .andExpect(jsonPath("$.currentPlayer").value("O"))
                .andExpect(jsonPath("$.status").value("in_progress"));
    }

    @Test
    void makeMove_returns400ForOccupiedCell() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game"))
                .andReturn();
        String id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();

        mockMvc.perform(post("/api/game/" + id + "/move")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new MoveRequest(0, 0))));

        mockMvc.perform(post("/api/game/" + id + "/move")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new MoveRequest(0, 0))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Cell is already occupied"));
    }

    @Test
    void makeMove_returns400ForInvalidCoordinates() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game"))
                .andReturn();
        String id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();

        mockMvc.perform(post("/api/game/" + id + "/move")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new MoveRequest(5, -1))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", containsString("Invalid coordinates")));
    }

    @Test
    void makeMove_returns400AfterGameOver() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game"))
                .andReturn();
        String id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();

        // Play to X win: X(0,0) O(1,0) X(0,1) O(1,1) X(0,2)
        makeMove(id, 0, 0);
        makeMove(id, 1, 0);
        makeMove(id, 0, 1);
        makeMove(id, 1, 1);
        makeMove(id, 0, 2);

        mockMvc.perform(post("/api/game/" + id + "/move")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new MoveRequest(2, 2))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Game is already over"));
    }

    @Test
    void makeMove_returns404ForUnknownGame() throws Exception {
        mockMvc.perform(post("/api/game/nonexistent/move")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new MoveRequest(0, 0))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Game not found"));
    }

    @Test
    void fullGame_detectsWin() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/game"))
                .andReturn();
        String id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText();

        makeMove(id, 0, 0); // X
        makeMove(id, 1, 0); // O
        makeMove(id, 0, 1); // X
        makeMove(id, 1, 1); // O

        mockMvc.perform(post("/api/game/" + id + "/move")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new MoveRequest(0, 2))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("x_wins"));
    }

    private void makeMove(String gameId, int row, int col) throws Exception {
        mockMvc.perform(post("/api/game/" + gameId + "/move")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new MoveRequest(row, col))));
    }
}
