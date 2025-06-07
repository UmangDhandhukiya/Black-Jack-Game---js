// Initialize game state variables
let userPoint = 0;
let dealerPoint = 0;
let aceCountDealer = 0;
let aceCountUser = 0;

// Display the saved username from localStorage on the page
document.getElementById("user").innerHTML = localStorage.getItem("user");

/**
 * Handles user form submission
 * - Validates user input
 * - Stores username in localStorage
 * - Redirects to the game home page
 */
function onHandle(event) {
  event.preventDefault();
  var userName = document.getElementById("name").value;

  if (userName) {
    window.location.href = "./Home.html";
    localStorage.setItem("user", userName);
  } else {
    alert("Please enter the name");
  }
}

/**
 * Returns the numeric value of a card
 * - ACE is counted as 11
 * - Face cards are counted as 10
 * - Others as their number value
 */
function cardValue(card) {
  if (card.value === "ACE") return 11;
  if (card.value === "JACK" || card.value === "QUEEN" || card.value === "KING")
    return 10;
  return parseInt(card.value);
}

/**
 * Draws a specified number of cards from a new deck
 * @param {number} count - Number of cards to draw
 * @returns JSON response with card data
 */
async function drawCard(count) {
  const data = await fetch(
    `https://www.deckofcardsapi.com/api/deck/new/draw/?count=${count}`
  );
  const json = await data.json();
  console.log(json);
  return json;
}

/**
 * Handles the initial draw:
 * - 1 card for dealer (visible)
 * - 2 cards for the user
 * - Updates points and DOM accordingly
 */
async function defaultDraw() {
  const data = await drawCard(3);

  data?.cards.map((card, index) => {
    if (index == 0) {
      // Dealer's first card
      const dealer = document.getElementById("left");
      const img = document.createElement("img");
      img.src = card?.image;
      dealer.appendChild(img);
      if (card.value === "ACE") return aceCountDealer++;
      dealerPoint += cardValue(card);
      adjustDealerAce(); // Handle ace adjustment
      document.getElementById("dealerPoints").innerHTML = `Points : ${dealerPoint}`;
    } else {
      // User's cards
      const User = document.getElementById("userCard");
      const img = document.createElement("img");
      img.src = card?.image;
      User.appendChild(img);
      userPoint += cardValue(card);
      document.getElementById("points").innerHTML = `Points : ${userPoint}`;
    }
  });
}
defaultDraw();

/**
 * Allows the user to draw one more card
 * - Updates user points and UI
 * - Ends the game if user busts (>21)
 */
async function drawNewCard() {
  const data = await drawCard(1);

  data?.cards.map((card) => {
    const User = document.getElementById("userCard");
    const img = document.createElement("img");
    img.src = card?.image;
    User.appendChild(img);
    userPoint += cardValue(card);
    document.getElementById("points").innerHTML = `Points : ${userPoint}`;
  });

  if (userPoint > 21) {
    const user = localStorage.getItem("user");
    const msg = `${user} Bust!`;
    document.getElementById("winner").innerHTML = msg;
    setTimeout(() => {
      restartGame();
    }, 5000);
  }
}

/**
 * When user chooses to stand:
 * - Dealer draws until reaching 17 or more
 * - Then the game decides the winner
 */
async function standUser() {
  const data = await drawCard(1);
  const backCard = document.getElementById("backCard");
  backCard.style.display = "none";

  if (dealerPoint < 17 && userPoint <= 21) {
    data?.cards.map((card) => {
      const dealer = document.getElementById("left");
      const img = document.createElement("img");
      img.src = card?.image;
      dealer.appendChild(img);
      if (card.value === "ACE") return aceCountDealer++;
      adjustDealerAce(); // Handle ace value if over 21
      dealerPoint += cardValue(card);
      document.getElementById("dealerPoints").innerHTML = `Points : ${dealerPoint}`;
    });
    standUser(); // Recursively draw for dealer until >= 17
  } else {
    userWins(); // Evaluate winner
  }
}

/**
 * Determines and displays the game result
 */
function userWins() {
  const user = localStorage.getItem("user");

  if (userPoint <= 21 && userPoint > dealerPoint) {
    document.getElementById("winner").innerHTML = `${user} Wins!`;
  } else if (userPoint > 21) {
    document.getElementById("winner").innerHTML = `${user} Bust!`;
  } else if (dealerPoint === userPoint) {
    document.getElementById("winner").innerHTML = "It's tie !";
  } else if (dealerPoint <= 21 && dealerPoint > userPoint) {
    document.getElementById("winner").innerHTML = "Dealer Wins!";
  } else {
    document.getElementById("winner").innerHTML = "Dealer Bust, Player Win!";
  }

  document.getElementById("buttons").style.display = "none";
  document.getElementById("restart").style.display = "block";
}

/**
 * Adjusts dealer points if ACE is present and total exceeds 21
 * - Converts ACE from 11 to 1 by subtracting 10
 */
function adjustDealerAce() {
  while (dealerPoint > 21 && aceCountDealer > 0) {
    dealerPoint -= 10;
    aceCountDealer--;
  }
}

/**
 * Placeholder for potential ACE handling feature (not implemented)
 */
function toggleAce() {}

/**
 * Restarts the game by reloading the page
 */
function restartGame() {
  location.reload();
}
