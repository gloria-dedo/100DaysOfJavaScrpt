
        // Game words with hints
        const words = [
            { word: "BEACH", hint: "Sandy shore by the ocean" },
            { word: "PIANO", hint: "Musical instrument with black and white keys" },
            { word: "TIGER", hint: "Large striped wild cat" },
            { word: "APPLE", hint: "Common fruit, often red or green" },
            { word: "SPACE", hint: "The final frontier" },
            { word: "JAVASCRIPT", hint: "A programming language understood by the gods only " }
        ];

        let currentWord = "";
        let currentHint = "";
        let guessedLetters = new Set();
        let mistakes = 0;
        let hintShown = false;

        // DOM elements
        const letterInput = document.getElementById("letterInput");
        const wordDisplay = document.getElementById("wordDisplay");
        const guessCount = document.getElementById("guessCount");
        const mistakeCount = document.getElementById("mistakeCount");
        const hintText = document.getElementById("hintText");
        const resetBtn = document.getElementById("resetBtn");
        const hintBtn = document.getElementById("hintBtn");

        // Initialize game
        function initGame() {
            // Reset game state
            const randomIndex = Math.floor(Math.random() * words.length);
            currentWord = words[randomIndex].word;
            currentHint = words[randomIndex].hint;
            guessedLetters.clear();
            mistakes = 0;
            hintShown = false;

            // Reset display
            updateDisplay();
            guessCount.textContent = guessedLetters.size;
            mistakeCount.textContent = mistakes;
            hintText.textContent = "Click to reveal";
            letterInput.value = "";
            letterInput.disabled = false;
        }

        // Update word display
        function updateDisplay() {
            wordDisplay.innerHTML = "";
            [...currentWord].forEach(letter => {
                const letterDiv = document.createElement("div");
                letterDiv.className = "w-10 h-10 border-b-2 border-green-500 flex items-center justify-center text-xl font-semibold";
                letterDiv.textContent = guessedLetters.has(letter) ? letter : "";
                wordDisplay.appendChild(letterDiv);
            });
        }

        // Check if game is won
        function checkWin() {
            return [...currentWord].every(letter => guessedLetters.has(letter));
        }

        // Handle letter input
        letterInput.addEventListener("input", (e) => {
            const letter = e.target.value.toUpperCase();
            if (letter && /[A-Z]/.test(letter)) {
                if (!guessedLetters.has(letter)) {
                    guessedLetters.add(letter);
                    if (!currentWord.includes(letter)) {
                        mistakes++;
                        mistakeCount.textContent = mistakes;
                    }
                    guessCount.textContent = guessedLetters.size;
                    updateDisplay();

                    if (checkWin()) {
                        setTimeout(() => {
                            alert("Congratulations! You won! 🎉");
                            letterInput.disabled = true;
                        }, 100);
                    }
                }
                e.target.value = "";
            }
        });

        // Show hint
        hintBtn.addEventListener("click", () => {
            if (!hintShown) {
                hintText.textContent = currentHint;
                hintShown = true;
            }
        });

        // Reset game
        resetBtn.addEventListener("click", initGame);

        // Start game
        initGame();
   