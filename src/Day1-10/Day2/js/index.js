// Function to generate random color
function genColorFn() {
    let randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    let hexColor = `#${randomColor}`;
    let rgbColor = hexToRgb(hexColor);

    // Update the displayed color values
    document.getElementById('colorDisplay').style.backgroundColor = hexColor;
    document.getElementById('colorHex').innerText = hexColor;
    document.getElementById('colorRgb').innerText = `RGB(${rgbColor})`;
}

// Function to convert HEX to RGB
function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

// Function to copy color code
function cpyFn(type) {
    let copyText = document.getElementById(type).innerText;
    navigator.clipboard.writeText(copyText).then(() => {
        // Display a message for successful copy
        let copyMessage = document.getElementById('copyMessage');
        copyMessage.innerText = `${type === 'colorHex' ? 'HEX' : 'RGB'} copied!`;
        copyMessage.classList.add('animate__fadeIn');
        setTimeout(() => {
            copyMessage.classList.remove('animate__fadeIn');
            copyMessage.innerText = '';
        }, 2000);
    });
}

// Function to toggle Dark Mode
function darkFn() {
    document.body.classList.toggle('dark');
}