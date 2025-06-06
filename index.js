let userPoint = 0;
let dealerPoint = 0;
let aceCountDealer = 0;
let aceCountUser = 0;
document.getElementById("user").innerHTML = localStorage.getItem("user");

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

function cardValue(card) {
  if (card.value === "ACE") return 11;
  if (card.value === "JACK" || card.value === "QUEEN" || card.value === "KING")
    return 10;
  return parseInt(card.value);
}

// async function shuffle() {
//   const data = await fetch(
//     "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
//   );
//   const json = await data.json();
//   console.log(json);
//   const deckId = json?.deck_id;
//   return deckId;
// }

async function drawCard(count) {
  // const deckId = await shuffle();
  const data = await fetch(
    `https://www.deckofcardsapi.com/api/deck/new/draw/?count=${count}`
  );
  const json = await data.json();
  console.log(json);
  return json;
}

async function defaultDraw() {
  const data = await drawCard(3);

  data?.cards.map((card, index) => {
    if (index == 0) {
      const dealer = document.getElementById("left");
      const img = document.createElement("img");
      img.src = card?.image;
      dealer.appendChild(img);
      if (card.value === "ACE") return aceCountDealer++;
      dealerPoint += cardValue(card);
      adjustDealerAce();
      document.getElementById("dealerPoints").innerHTML = `Points : ${dealerPoint}`;
    } 
    
    else {
      const User = document.getElementById("userCard");
      const img = document.createElement("img");
      img.src = card?.image;
      User.appendChild(img);
      // if (card.value === "ACE") return aceCountUser++;
      userPoint += cardValue(card);
      document.getElementById("points").innerHTML = `Points : ${userPoint}`;
    }
  });
}
defaultDraw();

async function drawNewCard() {
  const data = await drawCard(1);

  data?.cards.map((card) => {
    const User = document.getElementById("userCard");
    const img = document.createElement("img");
    img.src = card?.image;
    User.appendChild(img);
    // if (card.value === "ACE") return aceCountUser++;
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
      adjustDealerAce();
      dealerPoint += cardValue(card);
      document.getElementById(
        "dealerPoints"
      ).innerHTML = `Points : ${dealerPoint}`;
    });
    standUser();
  } else {
    userWins();
  }
}

function userWins() {
  if (userPoint <= 21 && userPoint > dealerPoint) {
    const user = localStorage.getItem("user");
    const msg = `${user} Wins!`;
    document.getElementById("winner").innerHTML = msg;
  } else if (userPoint > 21) {
    const user = localStorage.getItem("user");
    const msg = `${user} Bust!`;
    document.getElementById("winner").innerHTML = msg;
  } else if (dealerPoint === userPoint) {
    const msg = "It's tie !";
    document.getElementById("winner").innerHTML = msg;
  } else if (dealerPoint <= 21 && dealerPoint > userPoint) {
    const msg = "Dealer Wins!";
    document.getElementById("winner").innerHTML = msg;
  } else {
    const msg = "Dealer Bust, Player Win! ";
    document.getElementById("winner").innerHTML = msg;
  }

  document.getElementById("buttons").style.display = "none";
  document.getElementById("restart").style.display = "block";
}

function adjustDealerAce() {
  while (dealerPoint > 21 && aceCountDealer > 0) {
    dealerPoint -= 10;
    aceCountDealer--;
  }
}

function toggleAce() {}

function restartGame() {
  location.reload();
}
