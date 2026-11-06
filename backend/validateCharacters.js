const characters = require("./data/characters.json");

const requiredFields = [
    "id",
    "name",
    "difficulties",
    "real_name",
    "species",
    "is_human",
    "is_mutant",
    "is_superhero",
    "is_villain",
    "powers",
    "can_fly",
    "uses_technology",
    "affiliations",
    "origin",
    "first_appearance",
    "hints"
];

const ids = new Set();
let errors = 0;

characters.forEach((character, index) => {
    const label = character.name || `Character ${index + 1}`;

    for (const field of requiredFields) {
        if (character[field] === undefined || character[field] === null) {
            console.log(`Missing field "${field}" in ${label}`);
            errors++;
        }
    }

    if (ids.has(character.id)) {
        console.log(`Duplicate ID: ${character.id}`);
        errors++;
    }

    ids.add(character.id);

    if (!Array.isArray(character.difficulties) ||
        character.difficulties.some(d => !["easy", "medium", "hard"].includes(d))) {
        console.log(`Invalid difficulties in ${label}`);
        errors++;
    }

    for (const field of ["is_human", "is_mutant", "is_superhero", "is_villain", "can_fly", "uses_technology"]) {
        if (typeof character[field] !== "boolean") {
            console.log(`Invalid boolean "${field}" in ${label}`);
            errors++;
        }
    }

    for (const field of ["powers", "affiliations", "hints"]) {
        if (!Array.isArray(character[field])) {
            console.log(`"${field}" must be an array in ${label}`);
            errors++;
        }
    }
});

console.log("\nDatabase validation complete.");
console.log(`Characters checked: ${characters.length}`);
console.log(`Errors found: ${errors}`);