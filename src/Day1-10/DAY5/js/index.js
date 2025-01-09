function generatePassword() {
    const length = document.getElementById('characterLength').value;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let allChars = '';
    if (includeUppercase) allChars += upperCaseChars;
    if (includeLowercase) allChars += lowerCaseChars;
    if (includeNumbers) allChars += numberChars;
    if (includeSymbols) allChars += symbolChars;

    let password = '';
    for (let i = 0; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    document.getElementById('generatedPassword').value = password;
    updateStrength(password);
}

function copyPassword() {
    const password = document.getElementById('generatedPassword').value;
    navigator.clipboard.writeText(password).then(() => {
        alert('Password copied to clipboard!');
    });
}

function updateStrength(password) {
    let strength = 'Weak';
    if (password.length >= 12) {
        strength = 'Medium';
        
    }
    if (password.length >= 16 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password)) {
        strength = 'Strong';
    }
    document.getElementById('passwordStrength').textContent = strength;
}

document.getElementById('characterLength').addEventListener('input', function() {
    document.getElementById('characterValue').textContent = this.value;
});