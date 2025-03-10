
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        let intervalId = null;

        const hoursDisplay = document.getElementById('hours');
        const minutesDisplay = document.getElementById('minutes');
        const secondsDisplay = document.getElementById('seconds');
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const resetBtn = document.getElementById('resetBtn');

        function updateDisplay() {
            hoursDisplay.textContent = hours.toString().padStart(2, '0');
            minutesDisplay.textContent = minutes.toString().padStart(2, '0');
            secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        }

        function startTimer() {
            if (intervalId === null) {
                intervalId = setInterval(() => {
                    seconds++;
                    if (seconds === 60) {
                        seconds = 0;
                        minutes++;
                        if (minutes === 60) {
                            minutes = 0;
                            hours++;
                        }
                    }
                    updateDisplay();
                }, 1000);
                startBtn.classList.add('opacity-50', 'cursor-not-allowed');
                startBtn.disabled = true;
            }
        }

        function stopTimer() {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
                startBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                startBtn.disabled = false;
            }
        }

        function resetTimer() {
            stopTimer();
            hours = 0;
            minutes = 0;
            seconds = 0;
            updateDisplay();
        }

        startBtn.addEventListener('click', startTimer);
        stopBtn.addEventListener('click', stopTimer);
        resetBtn.addEventListener('click', resetTimer);
   