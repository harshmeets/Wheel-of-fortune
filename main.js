// Game logic variables
let coins = 100;
let timerInterval;
let isBettingAllowed = true;
const betAmounts = {
    red: 0,
    green: 0,
    yellow: 0,
    orange: 0,
    pink: 0,
    blue: 0,
    purple: 0,
};
const resultHistory = []; // Array to store the last 10 results

// Function to update the result history
function updateResultHistory(result, betDetails) {
    const resultWithDetails = {
        result: result,
        betDetails: betDetails,
    };

    resultHistory.push(resultWithDetails);
    if (resultHistory.length > 10) {
        resultHistory.shift(); // Remove the oldest result if there are more than 10
    }

    // Update the results list in the HTML
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; // Clear the list
    resultHistory.forEach((resultItem, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div>
                Result ${index + 1}: ${resultItem.result}
                <button class="show-details-button" data-index="${index}">Show Details</button>
            </div>
            <div class="bet-details" id="bet-details-${index}" style="display:none;">
                <p>User Bet: ${resultItem.betDetails.userBet}</p>
                ${resultItem.betDetails.payout > 0 ? `<p>Payout: ${resultItem.betDetails.payout}</p>` : ''}
            </div>
        `;
        resultsList.appendChild(listItem);

        // Add click event listener to the "Show Details" button
        const showDetailsButton = listItem.querySelector('.show-details-button');
        showDetailsButton.addEventListener('click', () => {
            const betDetailsDiv = document.getElementById(`bet-details-${index}`);
            if (betDetailsDiv.style.display === 'none') {
                betDetailsDiv.style.display = 'block';
            } else {
                betDetailsDiv.style.display = 'none';
            }
        });
    });
}

// Function to start the 30-second betting timer
function startBettingTimer() {
    let timerValue = 30; // 30 seconds timer

    // Update the timer display every second
    timerInterval = setInterval(() => {
        if (timerValue === 0) {
            // Betting time is up, stop the timer
            clearInterval(timerInterval);
            document.getElementById('timer').textContent = 'Betting Closed';
            startGame(); // Start the game after the betting period
        } else {
            document.getElementById('timer').textContent = timerValue;
        }
        timerValue--;
    }, 1000);
}

// Function to start the game
function startGame() {
    // Disable betting
    isBettingAllowed = false;

    // Remove click event listeners from color options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.removeEventListener('click', placeBet);
    });

    // Simulate a result (you can implement this logic)
    const result = simulateResult();

    // Calculate the payout based on the result
    const payout = calculatePayout(result);

    // Display result and payout in a dialog box with animation
    const resultDialog = document.getElementById('result-dialog');
    const resultDisplay = document.getElementById('result-display');

    // Show the result dialog with animation
    resultDialog.style.display = 'block';
    resultDisplay.textContent = `Result: ${result}, Payout: ${payout}`;

    // Update displayed coins based on the payout
    coins += payout;

    // Update displayed coins and bet amounts
    document.getElementById('coins').textContent = coins;
    updateBetAmounts();

    // Update the result history
    const betDetails = {
        userBet: calculateTotalUserBet(),
        payout: payout,
    };

    updateResultHistory(result, betDetails);

    // Reset the bet amounts to 0
    resetBetAmounts();

    // Reset the result dialog and enable betting after 5 seconds
    setTimeout(() => {
        resultDialog.style.display = 'none';
        enableBetting();
    }, 5000);
}

// Function to reset the bet amounts to 0
function resetBetAmounts() {
    for (const color in betAmounts) {
        betAmounts[color] = 0;
    }
    updateBetAmounts();
}

// Function to calculate the payout based on the result
function calculatePayout(result) {
    switch (result) {
        case 'pink':
            return betAmounts['pink'] * 10;
        case 'green':
            return betAmounts['green'] * 15;
        case 'blue':
            return betAmounts['blue'] * 50;
        case 'red':
            return betAmounts['red'] * 5;
        case 'yellow':
            return betAmounts['yellow'] * 5;
        case 'orange':
            return betAmounts['orange'] * 5;
        case 'purple':
            return betAmounts['purple'] * 50;
        default:
            return 0; // No payout for other colors
    }
}

// Function to calculate the total user bet
function calculateTotalUserBet() {
    let totalBet = 0;
    for (const color in betAmounts) {
        totalBet += betAmounts[color];
    }
    return totalBet;
}

// Function to enable betting
function enableBetting() {
    isBettingAllowed = true;

    // Add click event listeners to color options
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', placeBet);
    });

    // Start a new betting round
    startBettingTimer();
}

// Function to simulate a result (replace with actual logic)
function simulateResult() {
    const colors = ['red', 'green', 'yellow', 'orange', 'pink', 'blue', 'purple'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

// Function to handle placing a bet
function placeBet() {
    if (!isBettingAllowed) {
        // Betting not allowed at this time
        return;
    }

    const selectedColor = this.dataset.color;

    const betAmount = parseInt(prompt(`Place your bet on ${selectedColor} (Coins available: ${coins}):`, "1"));

    if (isNaN(betAmount) || betAmount <= 0 || betAmount > coins) {
        // Invalid bet amount
        alert('Invalid bet amount.');
        return;
    }

    // Deduct the bet amount from coins
    coins -= betAmount;

    // Update the bet amounts
    betAmounts[selectedColor] += betAmount;

    // Update displayed coins and bet amounts
    document.getElementById('coins').textContent = coins;
    updateBetAmounts();
}

// Function to update displayed bet amounts
function updateBetAmounts() {
    const betAmountElements = document.querySelectorAll('.bet-amount');
    betAmountElements.forEach(element => {
        const color = element.dataset.color;
        element.querySelector('span').textContent = betAmounts[color];
    });
}

// Function to handle adding coins
document.getElementById('add-coin-button').addEventListener('click', () => {
    const addedCoins = parseInt(prompt('Enter the number of coins to add:', "10"));

    if (isNaN(addedCoins) || addedCoins <= 0) {
        // Invalid input
        alert('Invalid number of coins.');
        return;
    }

    // Add the coins to the user's balance
    coins += addedCoins;

    // Update the displayed coins
    document.getElementById('coins').textContent = coins;
});

// Start the initial betting timer
startBettingTimer();
