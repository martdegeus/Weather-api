// Get the modal
var modal = document.getElementById("header__submit");    
// Get the button that opens the modal
var btn = document.getElementById("button");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("header__submit_close")[0];
// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//geolocation starts
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(displayLocationInfo);
}

let deleteLocal = document.querySelector('.current_location__delete');
 deleteLocal.addEventListener("click", function() {
   localStorage.clear();
   console.log(localStorage);
});

function displayLocationInfo(position) {
  const lng = position.coords.longitude;
  const lat = position.coords.latitude;

  let buttonArray = document.querySelector(".main__button");
  //local storage
  localStorage = window.localStorage;

  buttonArray.addEventListener("click", function() {
    let boxvalue = document.querySelector('.main__search').value;
    localStorage.setItem("cityNames-" + boxvalue, JSON.stringify(boxvalue));
    citySubmit(city = boxvalue);
    console.log(localStorage);
  })
  console.log(localStorage);
  weatherBalloon(lat, lng);
}

  //API KEY
  const key = "cac67298b97190e436286c4e1500ac73";

//Get current location
function weatherBalloon(lat,lng) {
  fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=' + key)  
  .then(function(resp) { return resp.json() }) // Convert data to json
  .then(function(data) {
    //console.log(data);
    drawWeather(data);
  })
  .catch(function() {
  });
}


function citySubmit(city) {
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key)  
  .then(function(resp) { return resp.json() }) // Convert data to json
  .then(function(data) {
    drawcityWeather(data);
  })
  .catch(function() {
  });
}

function drawcityWeather(c) {
  for (i = 0; i < localStorage.length; i++) {
    let currentI = localStorage.getItem(localStorage.key(i));
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${currentI}&appid=${key}`).then(result => {
        return result.json();
    }).then(result => {
        let maxcelcius = Math.round(parseFloat(c.main.temp_max)-273.15);
        fetchResult = result;
        document.querySelector(".locations").innerHTML += `
        <section class="location locations__item">
        <h2 class="location__title">${c.name}</h2>
        <img src="../images/weather.png" class="location__icon">
          <p class="location__temp">${maxcelcius}</p>
          <p class="location__temp"></p>
        </section>
    `
    })
}
}
//
function drawWeather(d) {
  let maxcelcius = Math.round(parseFloat(d.main.temp_max)-273.15);
  let mincelcius = Math.round(parseFloat(d.main.temp_min)-273.15);

  document.querySelector(".current_location__title-name").innerHTML = d.name;;
  document.querySelector(".current_location__temp--max").innerHTML = "Max temp " + maxcelcius + "&#8451;";
  document.querySelector(".current_location__temp--min").innerHTML = "Min temp " + mincelcius + "&#8451;";
  citySubmit(d.name);
}