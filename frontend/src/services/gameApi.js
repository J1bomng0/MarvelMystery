
const API_URL = "http://localhost:3000/api";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export function startGame(difficulty) {
  return apiRequest("/game/start", {
    method: "POST",
    body: JSON.stringify({ difficulty }),
  });
}

export function askQuestion(gameId, question) {
  return apiRequest(`/game/${gameId}/ask`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export function requestHint(gameId) {
  return apiRequest(`/game/${gameId}/hint`, {
    method: "POST",
  });
}

export function submitGuess(gameId, guess) {
  return apiRequest(`/game/${gameId}/guess`, {
    method: "POST",
    body: JSON.stringify({ guess }),
  });
}
