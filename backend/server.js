const express = require("express");
const cors = require("cors");
const characters = require("./data/characters.json");
const { interpretQuestion, generateHint } = require("./gemini");

const app = express();
const { randomUUID } = require("crypto");

const games = new Map();

const hintLimits = {
    easy: 15,
    medium: 10,
    hard: 5
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Marvel Mystery API is running!");
});

app.post("/api/game/start", (req, res) => {
    const { difficulty } = req.body;

    if (!hintLimits[difficulty]) {
        return res.status(400).json({
            error: "Invalid difficulty"
        });
    }

    const availableCharacters = characters.filter(character =>
        character.difficulties.includes(difficulty)
    );

    if (availableCharacters.length === 0) {
        return res.status(404).json({
            error: "No characters available for this difficulty"
        });
    }

    const randomIndex = Math.floor(
        Math.random() * availableCharacters.length
    );

    const selectedCharacter = availableCharacters[randomIndex];

    const gameId = randomUUID();

    const game = {
        id: gameId,
        difficulty: difficulty,
        character: selectedCharacter,
        hintsRemaining: hintLimits[difficulty],
        status: "playing",
        revealedHints: []
    };

    games.set(gameId, game);

    res.status(201).json({
        gameId: gameId,
        difficulty: difficulty,
        hintsRemaining: game.hintsRemaining,
        status: game.status
    });
});

app.post("/api/game/:gameId/guess", (req, res) => {
    const { gameId } = req.params;
    const { guess } = req.body;

    const game = games.get(gameId);

    if (!game) {
        return res.status(404).json({
            error: "Game not found"
        });
    }

    if (game.status !== "playing") {
        return res.status(400).json({
            error: "This game has already ended"
        });
    }

    if (!guess || typeof guess !== "string") {
        return res.status(400).json({
            error: "Please enter a character name"
        });
    }

    const normalize = (text) =>
        text.toLowerCase().trim();

    const acceptedNames = [
        game.character.name,
        game.character.real_name,
        game.character.id,
        ...(game.character.aliases || [])
    ].filter(Boolean);

    const isCorrect = acceptedNames.some(name =>
        normalize(name) === normalize(guess)
    );

    if (isCorrect) {
        game.status = "won";

        return res.json({
            correct: true,
            status: "won",
            message: "You found the character!"
        });
    }

    if (game.hintsRemaining > 0) {
        return res.json({
            correct: false,
            status: "playing",
            hintsRemaining: game.hintsRemaining,
            message: "Incorrect! Keep investigating."
        });
    }

    game.status = "lost";

    return res.json({
        correct: false,
        status: "lost",
        message: "Game over!",
        character: game.character.name
    });
});


app.post("/api/game/:gameId/ask", async (req, res) => {
    try {
        const { gameId } = req.params;
        const { question } = req.body;

        const game = games.get(gameId);

        if (!game) {
            return res.status(404).json({
                error: "Game not found"
            });
        }

        if (game.status !== "playing") {
            return res.status(400).json({
                error: "This game has already ended"
            });
        }

        if (
            typeof question !== "string" ||
            !question.trim() ||
            question.length > 200
        ) {
            return res.status(400).json({
                error: "Please enter a valid question (maximum 200 characters)."
            });
        }

        const interpretation = await interpretQuestion(question);

        const allowedFields = [
            "is_human",
            "is_mutant",
            "is_superhero",
            "is_villain",
            "can_fly",
            "uses_technology",
            "powers",
            "affiliations",
            "species",
            "origin",
            "first_appearance"
        ];

        if (!allowedFields.includes(interpretation.field)) {
            return res.json({
                answer: "UNKNOWN",
                message: "I couldn't understand that question. Try asking differently."
            });
        }

        const character = game.character;
        const { field, searchTerm } = interpretation;

        console.log("Interpretation:", interpretation);
        console.log("Character powers:", character.powers);

        let answer;

        if (field === "powers" || field === "affiliations") {
            if (!searchTerm || !searchTerm.trim()) {
                return res.json({
                    answer: "UNKNOWN",
                    message: "Please ask about a specific power or team."
                });
            }       

        const values = character[field] || [];

        answer = values.some(value => value.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
        }   else if (
            field === "species" ||
            field === "origin" ||
            field === "first_appearance"
        ) {
            answer = "UNSUPPORTED";
        } else {
            answer = character[field];
        }

        if (answer === "UNSUPPORTED") {
            return res.json({
                answer: "UNKNOWN",
                message: "I can't answer that type of question yet."
            });
        }

        if (typeof answer !== "boolean") {
            return res.json({
                answer: "UNKNOWN",
                message: "I couldn't determine the answer."
            });
        }

        return res.json({
            answer: answer ? "YES" : "NO",
            field: field
        });

    } catch (error) {
        console.error("Question error:", error);

        return res.status(500).json({
            error: "Something went wrong while processing your question."
        });
    }
});



app.post("/api/game/:gameId/hint", async (req, res) => {
    try {
        const { gameId } = req.params;
        const game = games.get(gameId);

        if (!game) {
            return res.status(404).json({
                error: "Game not found"
            });
        }

        if (game.status !== "playing") {
            return res.status(400).json({
                error: "This game has already ended"
            });
        }

        if (game.hintsRemaining <= 0) {
            return res.status(400).json({
                error: "No hints remaining."
            });
        }

        const availableHints = game.character.hints.filter(
            (hint, index) => !game.revealedHints.includes(index)
        );

        if (availableHints.length === 0) {
            return res.status(400).json({
                error: "No more hints available for this character."
            });
        }

        const hintIndex = game.character.hints.findIndex(
            (hint, index) => !game.revealedHints.includes(index)
        );

        const originalHint = game.character.hints[hintIndex];

        const generatedHint = await generateHint(originalHint);

        game.revealedHints.push(hintIndex);
        game.hintsRemaining--;

        return res.json({
            hint: generatedHint,
            hintsRemaining: game.hintsRemaining,
            status: game.status
        });

    } catch (error) {
        console.error("Hint error:", error);

        return res.status(500).json({
            error: "Something went wrong while generating your hint."
        });
    }
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});