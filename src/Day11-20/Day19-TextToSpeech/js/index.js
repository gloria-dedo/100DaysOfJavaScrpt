
const textInput = document.getElementById("text-input");
const voiceSelect = document.getElementById("voice-select");
const playPauseBtn = document.getElementById("playPauseBtn");
const backwardBtn = document.getElementById("backwardBtn");
const forwardBtn = document.getElementById("forwardBtn");

let synth = window.speechSynthesis;
let currentUtterance = null;
let isPlaying = false;
let voices = [];

// Load and initialize voices
function loadVoices() {
    return new Promise((resolve) => {
        voices = synth.getVoices();
        if (voices.length > 0) {
            resolve(voices);
        } else {
            speechSynthesis.onvoiceschanged = () => {
                voices = synth.getVoices();
                resolve(voices);
            };
        }
    });
}

// Populate voice select dropdown
async function populateVoiceList() {
    const voices = await loadVoices();
    voiceSelect.innerHTML = '<option value="">Select a voice...</option>';
    
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });

    // Try to set default voice
    const defaultVoice = voices.find(voice => voice.name.includes("US English") || voice.lang.includes("en-US"));
    if (defaultVoice) {
        voiceSelect.value = defaultVoice.name;
    }
}

// Initialize voices
populateVoiceList();

// Create speech utterance
function createUtterance(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    const selectedVoice = voices.find(voice => voice.name === voiceSelect.value);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
        isPlaying = false;
        currentUtterance = null;
        updatePlayPauseIcon();
    };

    utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event);
        isPlaying = false;
        currentUtterance = null;
        updatePlayPauseIcon();
    };
    
    return utterance;
}

// Update play/pause button icon
function updatePlayPauseIcon() {
    const icon = playPauseBtn.querySelector('i');
    icon.className = isPlaying ? 'fa fa-pause-circle text-white text-xl' : 'fa fa-play-circle text-white text-xl';
}

// Stop current speech
function stopSpeech() {
    synth.cancel();
    isPlaying = false;
    currentUtterance = null;
    updatePlayPauseIcon();
}

// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    
    if (!text) {
        alert('Please enter some text to speak');
        return;
    }

    if (!voiceSelect.value) {
        alert('Please select a voice');
        return;
    }

    if (!isPlaying) {
        stopSpeech(); // Clear any existing speech
        currentUtterance = createUtterance(text);
        synth.speak(currentUtterance);
        isPlaying = true;
    } else {
        synth.cancel();
        isPlaying = false;
    }
    
    updatePlayPauseIcon();
});

// Handle voice changes
voiceSelect.addEventListener('change', () => {
    if (isPlaying) {
        stopSpeech();
    }
});

// Skip forward (increase rate)
forwardBtn.addEventListener('click', () => {
    if (currentUtterance) {
        stopSpeech();
        const newUtterance = createUtterance(textInput.value.trim());
        newUtterance.rate = Math.min(2, currentUtterance.rate + 0.25);
        currentUtterance = newUtterance;
        synth.speak(currentUtterance);
        isPlaying = true;
        updatePlayPauseIcon();
    }
});

// Skip backward (decrease rate)
backwardBtn.addEventListener('click', () => {
    if (currentUtterance) {
        stopSpeech();
        const newUtterance = createUtterance(textInput.value.trim());
        newUtterance.rate = Math.max(0.5, currentUtterance.rate - 0.25);
        currentUtterance = newUtterance;
        synth.speak(currentUtterance);
        isPlaying = true;
        updatePlayPauseIcon();
    }
});

// Reset speech when text changes
textInput.addEventListener('input', () => {
    if (isPlaying) {
        stopSpeech();
    }
});

// Clean up when leaving page
window.addEventListener('beforeunload', () => {
    synth.cancel();
});
