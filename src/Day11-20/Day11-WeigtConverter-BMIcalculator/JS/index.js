function openTabs(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("show");
    }

    // Adding timeout to allow fade-out effect before switching tabs
    setTimeout(() => {
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        document.getElementById(tabName).style.display = "block";
        setTimeout(() => {
            document.getElementById(tabName).classList.add("show");
        }, 50);
    }, 300);

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("tab-active");
    }

    evt.currentTarget.classList.add("tab-active");
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.tablinks').click();
});

//Check weight form

function showPopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('animate-fadeIn');
}

function closePopup() {
    const overlay = document.getElementById('popupOverlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('animate-fadeIn');
    // document.getElementById('kg').value = '';
}

document.addEventListener('DOMContentLoaded', function() {
    const weightForm = document.getElementById('kgForm');
    const weightInput = document.getElementById('kg');
    const weightResult = document.getElementById('weightResult');
    const popupOverlay = document.getElementById('popupOverlay');

    weightForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset classes
        weightResult.className = 'text-2xl font-medium text-green-600';
        
        if (isNaN(weightInput.value) || weightInput.value <= 0) {
            weightResult.className = 'text-2xl font-medium text-red-500';
            weightResult.textContent = 'Please enter a valid number!';
            showPopup();
            
            setTimeout(() => {
                closePopup();
                weightResult.textContent = '';
            }, 2500);
        } else {
            const kgToPound = Number(weightInput.value) * 2.20462;
            weightResult.textContent = `${kgToPound.toFixed(2)} lbs`;
            showPopup();
        }
    });

    // Close popup when clicking overlay
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });

    // Clear form when switching tabs
    const tablinks = document.getElementsByClassName('tablinks');
    Array.from(tablinks).forEach(tab => {
        tab.addEventListener('click', () => {
            closePopup();
            weightInput.value = '';
        });
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
});


// Function to calculate BMI and provide interpretation
function calculateBMI(weight, height, age) {
    // Check if height is likely in meters (less than 3) and convert to cm if needed
    const heightInMeters = height > 3 ? height / 100 : height;
    
    // Calculate BMI using height in meters
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Determine BMI category and get health advice
    let category, interpretation, advice;
    
    if (bmi < 18.5) {
        category = "Underweight";
        interpretation = "Your BMI indicates you are underweight for your height.";
        advice = "Consider consulting a healthcare provider about healthy ways to gain weight. Focus on nutrient-rich foods and strength training exercises.";
    } else if (bmi >= 18.5 && bmi < 25) {
        category = "Normal Weight";
        interpretation = "Your BMI falls within the healthy weight range.";
        advice = "Maintain your healthy lifestyle with balanced nutrition and regular physical activity.";
    } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
        interpretation = "Your BMI indicates you are overweight for your height.";
        advice = "Consider making lifestyle changes such as increasing physical activity and maintaining a balanced diet.";
    } else {
        category = "Obese";
        interpretation = "Your BMI indicates obesity.";
        advice = "It's recommended to consult with healthcare providers about weight management strategies.";
    }

    // Age-specific considerations
    let ageContext = "";
    if (age < 18) {
        ageContext = "Note: BMI calculations for individuals under 18 should be interpreted differently. Please consult with a pediatrician.";
    } else if (age > 65) {
        ageContext = "Note: For older adults, BMI may be less accurate as it doesn't account for natural changes in body composition with age.";
    }

    return {
        bmi: bmi.toFixed(1),
        category,
        interpretation,
        ageContext,
        advice
    };
}

function showBmiPopup() {
    document.getElementById('bmiPopup').classList.remove('hidden');
    document.getElementById('bmiPopup').classList.add('animate-fadeIn');
}

function closeBmiPopup() {
    document.getElementById('bmiPopup').classList.add('hidden');
    document.getElementById('bmiPopup').classList.remove('animate-fadeIn');
    // document.getElementById('bmiForm').reset();
}

function showBmiError(message) {
    document.getElementById('bmiPopup').classList.remove('hidden');
    document.getElementById('bmiPopup').classList.add('animate-fadeIn');
    
    // Update popup content to show error
    document.getElementById('bmiValue').textContent = "Error";
    document.getElementById('bmiCategory').textContent = "";
    document.getElementById('bmiInterpretation').textContent = message;
    document.getElementById('ageContext').textContent = "";
    document.getElementById('healthAdvice').textContent = "Please try again with valid inputs.";
}

document.addEventListener('DOMContentLoaded', function() {

    // document.querySelectorAll('#popupOverlay button, #bmiPopup button').forEach(button => {
    //     button.addEventListener('click', function(e) {
    //         // Stop the event from bubbling up to form
    //         e.stopPropagation();
            
    //         // Check which popup to close
    //         if (this.closest('#popupOverlay')) {
    //             closePopup();
    //         } else if (this.closest('#bmiPopup')) {
    //             closeBmiPopup();
    //         }
    //     });
    // });


    const bmiForm = document.getElementById('bmiForm');
    
    bmiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get input values
        const age = parseFloat(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);

        // Validate inputs
        if (isNaN(age) || age <= 0 || isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
            showBmiError("Please enter valid numbers for all fields");
            return;
        }

        // Calculate BMI and get interpretation
        const result = calculateBMI(weight, height, age);

        // Update popup content
        document.getElementById('bmiValue').textContent = `BMI: ${result.bmi}`;
        document.getElementById('bmiCategory').textContent = result.category;
        document.getElementById('bmiInterpretation').textContent = result.interpretation;
        document.getElementById('ageContext').textContent = result.ageContext;
        document.getElementById('healthAdvice').textContent = result.advice;

        // Show popup
        showBmiPopup();
    });

    // Close popup when clicking outside
    document.getElementById('bmiPopup').addEventListener('click', function(e) {
        if (e.target === this) {
            closeBmiPopup();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeBmiPopup();
        }
    });
});