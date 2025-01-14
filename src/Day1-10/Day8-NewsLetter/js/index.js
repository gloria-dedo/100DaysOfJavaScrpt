function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function toggleNewsletter(){
    const newsletter = document.getElementById("newsletter");
    newsletter.classList.toggle("hidden");
}

function handleSubscribe() {
    const emailInput = document.getElementById("email-input");
    const errorMessage = document.getElementById("error-message");
    const newsletterContent = document.getElementById("newsletter-content");
    const thankYouMessage = document.getElementById("thank-you-message");
    
    if (!emailInput.value) {
        errorMessage.textContent = "Please enter your email address";
        errorMessage.classList.remove("hidden");
        return;
    }

    if (!validateEmail(emailInput.value)) {
        errorMessage.textContent = "Please enter a valid email address";
        errorMessage.classList.remove("hidden");
        return;
    }

    // Hide error message if it was showing
    errorMessage.classList.add("hidden");
    
    // Hide newsletter content and show thank you message
    newsletterContent.classList.add("hidden");
    thankYouMessage.classList.remove("hidden");

    // Clear input
    emailInput.value = "";

    // Close newsletter after 3 seconds
    setTimeout(() => {
        toggleNewsletter();
        // Reset to original state after newsletter is hidden
        setTimeout(() => {
            newsletterContent.classList.remove("hidden");
            thankYouMessage.classList.add("hidden");
        }, 500);
    }, 8000);
}