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

document.getElementById("user").innerHTML = localStorage.getItem("user");

async function shuffle() {
  const data = await fetch(
    "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
  );
  const json = await data.json();
  console.log(json);
}
shuffle();

async function drawCard() {
  const data = await fetch(
    "https://www.deckofcardsapi.com/api/deck/3teevlx9e2co/draw/?count=3"
  );
  const json = await data.json();
  console.log(json);

  json?.cards.map((card, index) => {
    if (index == 0) {
      const dealer = document.getElementById("left");
      const img = document.createElement("img");
      img.src = card?.image;
      dealer.appendChild(img);
    } else {
      const User = document.getElementById("userCard");
      const img = document.createElement("img");
      img.src = card?.image;
      User.appendChild(img);
    }
  });

  // const image = document.getElementById("dealerCard");
  // image.src = json?.cards[0]?.image
}
drawCard();
