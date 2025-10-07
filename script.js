document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const startBtn = document.getElementById('start-btn');
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const message = document.getElementById('message');
    const numberLine = document.querySelector('.number-line');
    const frog1 = document.getElementById('frog1');
    const frog2 = document.getElementById('frog2');

    let gameInProgress = false;

    // Event listener for the start button
    startBtn.addEventListener('click', () => {
        if (gameInProgress) return;

        // Get user input
        const num1 = parseInt(num1Input.value);
        const num2 = parseInt(num2Input.value);

        // Validate input
        if (isNaN(num1) || isNaN(num2) || num1 < 1 || num2 < 1 || num1 > 10 || num2 > 10) {
            message.textContent = 'Please enter numbers between 1 and 10.';
            return;
        }

        // Reset and start the game
        resetGame();
        startGame(num1, num2);
    });

    // Reset the game to its initial state
    function resetGame() {
        gameInProgress = false;
        numberLine.innerHTML = '';
        message.textContent = '';
        frog1.style.left = '-25px';
        frog2.style.left = '-25px';
        startBtn.textContent = 'Start Game';
    }

    // Start the game logic
    function startGame(num1, num2) {
        gameInProgress = true;
        startBtn.textContent = 'Game in Progress...';

        // Calculate a reasonable maximum for the number line
        const lcmForMax = (num1 * num2) / gcd(num1, num2);
        const max = Math.max(20, lcmForMax + Math.max(num1, num2));
        const numberLineWidth = numberLine.offsetWidth;

        drawNumberLine(max, numberLineWidth);

        let frog1Pos = 0;
        let frog2Pos = 0;
        let frog1Jumps = [0];
        let frog2Jumps = [0];

        // Animate the frog jumps at intervals
        const jumpInterval = setInterval(() => {
            // Move frog 1
            if (frog1Pos <= max) {
                frog1Pos += num1;
                if(frog1Pos <= max) {
                    frog1.style.left = `${(frog1Pos / max) * numberLineWidth - 25}px`;
                    frog1Jumps.push(frog1Pos);
                    markLanding(frog1Pos, max, numberLineWidth, '#8bc34a');
                }
            }

            // Move frog 2
            if (frog2Pos <= max) {
                frog2Pos += num2;
                if(frog2Pos <= max) {
                    frog2.style.left = `${(frog2Pos / max) * numberLineWidth - 25}px`;
                    frog2Jumps.push(frog2Pos);
                    markLanding(frog2Pos, max, numberLineWidth, '#ffeb3b');
                }
            }

            // Check for the LCM
            const commonJumps = frog1Jumps.filter(jump => frog2Jumps.includes(jump) && jump !== 0);

            if (commonJumps.length > 0) {
                const lcm = Math.min(...commonJumps);
                message.textContent = `The LCM of ${num1} and ${num2} is ${lcm}!`;
                clearInterval(jumpInterval);
                gameInProgress = false;
                startBtn.textContent = 'Play Again';
            }

            // End condition if no LCM is found within the range
            if (frog1Pos > max && frog2Pos > max) {
                clearInterval(jumpInterval);
                gameInProgress = false;
                startBtn.textContent = 'Play Again';
                if (commonJumps.length === 0) {
                    message.textContent = 'No common jumps found within this range. Try again!';
                }
            }
        }, 800);
    }

    // Draw the number line with marks and labels
    function drawNumberLine(max, width) {
        for (let i = 0; i <= max; i++) {
            const mark = document.createElement('div');
            mark.classList.add('mark');
            mark.style.left = `${(i / max) * width}px`;

            if (i % 5 === 0 || max < 30) { // Adjust label frequency based on max value
                const label = document.createElement('span');
                label.classList.add('label');
                label.textContent = i;
                mark.appendChild(label);
            }

            numberLine.appendChild(mark);
        }
    }

    // Mark the landing spots for each frog
    function markLanding(position, max, width, color) {
        const landingMark = document.createElement('div');
        landingMark.classList.add('landing-mark');
        landingMark.style.left = `${(position / max) * width}px`;
        landingMark.style.backgroundColor = color;
        numberLine.appendChild(landingMark);
    }

    // Helper function to calculate the greatest common divisor (for LCM calculation)
    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }
});