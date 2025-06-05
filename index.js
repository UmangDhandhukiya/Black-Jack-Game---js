let userPoint = 0;
let dealerPoint = 0;
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

async function shuffle() {
  const data = await fetch(
    "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
  );
  const json = await data.json();
  console.log(json);
  const deckId = json?.deck_id;
  return deckId;
}

function cardValue(card) {
  if (card.value === "ACE") return 11;
  if (card.value === "JACK" || card.value === "QUEEN" || card.value === "KING")
    return 10;
  return parseInt(card.value);
}

async function drawCard(count) {
  const deckId = await shuffle();
  const data = await fetch(
    `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`
  );
  const json = await data.json();
  console.log(json);
  return json;

  // const image = document.getElementById("dealerCard");
  // image.src = json?.cards[0]?.image
}

async function defaultDraw() {
  const data = await drawCard(3);

  data?.cards.map((card, index) => {
    if (index == 0) {
      const dealer = document.getElementById("left");
      const img = document.createElement("img");
      img.src = card?.image;
      dealer.appendChild(img);
      dealerPoint += cardValue(card);
      document.getElementById(
        "dealerPoints"
      ).innerHTML = `Points : ${dealerPoint}`;
    } else {
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
  userWins();
}

async function stayUser() {
  const data = await drawCard(1);

  data?.cards.map((card) => {
    const dealer = document.getElementById("left");
    const img = document.createElement("img");
    img.src = card?.image;
    dealer.appendChild(img);
    dealerPoint += cardValue(card);
    document.getElementById(
      "dealerPoints"
    ).innerHTML = `Points : ${dealerPoint}`;
  });
  userWins();
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
  } else if (dealerPoint <= 21 && dealerPoint > userPoint) {
    const msg = "Dealer Wins!";
    document.getElementById("winner").innerHTML = msg;
  } else {
    const msg = "Dealer Bust!";
    document.getElementById("winner").innerHTML = msg;
  }
}
