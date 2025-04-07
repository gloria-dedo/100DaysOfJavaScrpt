
document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let Questions = [];
    let currQuestion = 0;
    let score = 0;
    const ques = document.getElementById("ques");
    const answersDiplay = document.getElementById("answersDiplay");
    const questionNum = document.getElementById("questionNum");
    const nextBtn = document.getElementById("nextBtn");
    const previousBtn = document.getElementById("previousBtn");
    const resultPopup = document.getElementById("resultPopup");
    const quizScore = document.getElementById("quizScore");
    const questionDisplay = document.getElementById("questionDisplay");
    const restartBtn = document.getElementById("restartBtn");
    
    // Fetch questions
    async function fetchQuestions() {
        try {
            ques.innerText = "Loading questions...";
            const response = await fetch('https://opentdb.com/api.php?amount=10');
            if (!response.ok) {
                throw new Error("Something went wrong!! Unable to fetch the data");
            }
            const data = await response.json();
            Questions = data.results;
            loadQuestion();
        }
        catch (error) {
            console.log(error);
            ques.innerHTML = `<h5 style='color: red'>${error}</h5>`;
        }
    }
    
    // Load a question
    function loadQuestion() {
        if (Questions.length === 0) {
            ques.innerText = "No questions available. Please try again.";
            return;
        }
        
        // Update question number
        questionNum.textContent = `${currQuestion + 1}/${Questions.length}`;
        
        // Clean the text from HTML entities
        let currentQuestion = Questions[currQuestion].question;
        currentQuestion = cleanText(currentQuestion);
        ques.innerText = currentQuestion;
        
        // Clear previous options
        answersDiplay.innerHTML = "";
        
        // Get correct answer and incorrect answers
        const correctAnswer = cleanText(Questions[currQuestion].correct_answer);
        const incorrectAnswers = Questions[currQuestion].incorrect_answers.map(answer => cleanText(answer));
        
        // Combine and shuffle options
        const options = [correctAnswer, ...incorrectAnswers];
        options.sort(() => Math.random() - 0.5);
        
        // Create option elements
        options.forEach((option, index) => {
            const optionId = `option${index + 1}`;
            const optionContainer = document.createElement("div");
            optionContainer.className = "option-container bg-white rounded-xl justify-between flex p-4 shadow-sm hover:bg-[#ABD1C6] hover:text-[#004643] cursor-pointer";
            
            optionContainer.innerHTML = `
                <label for="${optionId}" class="cursor-pointer w-full">${option}</label>
                <div class="flex items-center">
                    <i class="fas fa-check text-white check-icon mr-2 fa-sm"></i>
                    <input type="radio" name="answer" id="${optionId}" value="${option}" class="option-radio">
                </div>
            `;
            
            // Add click event to the option container
            optionContainer.addEventListener('click', function() {
                // Remove selected class from all containers
                document.querySelectorAll('.option-container').forEach(cont => {
                    cont.classList.remove('option-selected');
                });
                
                // Add selected class to clicked container
                this.classList.add('option-selected');
                
                // Check the radio button
                const radio = this.querySelector('input[type="radio"]');
                radio.checked = true;
            });
            
            answersDiplay.appendChild(optionContainer);
        });
        
        // Enable/disable previous button based on current question
        previousBtn.style.visibility = currQuestion === 0 ? "hidden" : "visible";
    }
    
    // Clean text from HTML entities
    function cleanText(text) {
        return text
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/'/g, "'");
    }
    
    // Handle next button click
    nextBtn.addEventListener('click', function() {
        // Get the selected option
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        
        if (selectedOption) {
            // Check if answer is correct
            const correctAnswer = cleanText(Questions[currQuestion].correct_answer);
            if (selectedOption.value === correctAnswer) {
                score++;
            }
            
            // Move to next question or show results
            if (currQuestion < Questions.length - 1) {
                currQuestion++;
                loadQuestion();
            } else {
                // Show results when all questions are answered
                showResults();
            }
        } else {
            alert('Please select an answer before proceeding.');
        }
    });
    
    // Handle previous button click
    previousBtn.addEventListener('click', function() {
        if (currQuestion > 0) {
            currQuestion--;
            loadQuestion();
        }
    });
    
    // Show quiz results
    function showResults() {
        questionDisplay.style.display = "none";
        answersDiplay.style.display = "none";
        nextBtn.style.display = "none";
        previousBtn.style.display = "none";
        
        // Update score display
        quizScore.textContent = `${score}/${Questions.length}`;
        
        // Update success message based on score
        const successMessage = document.getElementById("successMessage");
        const percentage = (score / Questions.length) * 100;
        
        if (percentage >= 80) {
            successMessage.innerHTML = `Congratulations! <span class="text-wrap text-lg font-normal">Great job, you did it!</span>`;
        } else if (percentage >= 50) {
            successMessage.innerHTML = `Good effort! <span class="text-wrap text-lg font-normal">You're making progress!</span>`;
        } else {
            successMessage.innerHTML = `Keep practicing! <span class="text-wrap text-lg font-normal">You'll do better next time!</span>`;
        }
        
        // Show result popup
        resultPopup.classList.remove("hidden");
        resultPopup.style.display = "flex";
    }
    
    // Handle restart button click
    restartBtn.addEventListener('click', function() {
        // Reset variables
        currQuestion = 0;
        score = 0;
        
        // Reset display
        questionDisplay.style.display = "block";
        answersDiplay.style.display = "block";
        nextBtn.style.display = "block";
        previousBtn.style.display = "inline";
        resultPopup.classList.add("hidden");
        resultPopup.style.display = "none";
        
        // Fetch new questions
        fetchQuestions();
    });
    
    // Initialize the quiz
    fetchQuestions();
});
