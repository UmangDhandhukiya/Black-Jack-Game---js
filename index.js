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