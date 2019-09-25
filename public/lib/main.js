//API KEY
const key = "cac67298b97190e436286c4e1500ac73";
const buttonArray = document.querySelector(".main__button");
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

//
function drawWeather(d) {
  let maxcelcius = Math.round(parseFloat(d.main.temp_max)-273.15);
  let mincelcius = Math.round(parseFloat(d.main.temp_min)-273.15);

  document.querySelector(".current_location__title-name").innerHTML = d.name;;
  document.querySelector(".current_location__temp--max").innerHTML = "Max temp " + maxcelcius + "&#8451;";
  document.querySelector(".current_location__temp--min").innerHTML = "Min temp " + mincelcius + "&#8451;";
  citySubmit(d.name);
}

//geolocation starts
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(displayLocationInfo);
}

function displayLocationInfo(position) {
  const lng = position.coords.longitude;
  const lat = position.coords.latitude;

  console.log(localStorage);
  weatherBalloon(lat, lng);
}

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

let deleteLocal = document.querySelector('.current_location__delete');
 deleteLocal.addEventListener("click", function() {
   localStorage.clear();
   location.reload();
});

//local storage
localStorage = window.localStorage;

buttonArray.addEventListener("click", function() {
  let boxvalue = document.querySelector('.main__search').value;
  localStorage.setItem("cityNames-" + boxvalue, boxvalue);
  location.reload();
})

function drawWeatherMain(c) {
  console.log(c.name);
  const container = document.querySelector('.cityNames-' + c.name);
  let maxcelcius = Math.round(parseFloat(c.main.temp_max)-273.15);
  let mincelcius = Math.round(parseFloat(c.main.temp_min)-273.15);

  container.innerHTML += `
    <h2 class="location__title">${c.name}</h2>
    <img src="../images/weather.png" class="location__icon">
      <p class="location__temp">Max temp ${maxcelcius}&#8451;</p>
      <p class="location__temp">Min temp ${mincelcius}&#8451;</p>
  	`;
  //document.querySelector(".location__title").innerHTML = c.name;
  //document.querySelector(".location__temp").innerHTML = Math.round(parseFloat(c.main.temp_max) - 273.15) + " °C";
  /*console.log(c.weather[0].main);
  switch (c.weather[0].main) {
      case "Thunderstorm":
          console.log('thunderstorm');
          document.querySelector('.location__icon').src = "../images/thunder.svg";
          break;
      case "Drizzle":
          console.log('Drizzle');
          document.querySelector('.location__icon').src = "../images/raining.svg";
          break;
      case "Rain":
          console.log('Rain');
          document.querySelector('.location__icon').src = "../images/raining.svg";
          break;
      case "Snow":
          console.log('Snow');
          document.querySelector('.location__icon').src = "../images/snow.svg";
          break;
      case "Clear":
          console.log('Clear');
          document.querySelector('.location__icon').src = "../images/sunny.svg";
          break;
      case "Clouds":
          console.log('Clouds');
          document.querySelector('.location__icon').src = "../images/cloudy.svg";
          break;

      default:
          console.log('default');
          break;*/
  }


function drawcityWeather() {
  for (i = 0; i < localStorage.length; i++) {
    const container = document.querySelector(".locations");
    container.innerHTML += `
      <section class="location locations__item ${localStorage.key(i)}">
      </section>
      `;
    let currentI = localStorage.getItem(localStorage.key(i));
    console.log(currentI);
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${currentI}&appid=${key}`).then(result => {
        return result.json();
    }).then(result => {
      console.log(result);
       drawWeatherMain(result);
    })
}
}

drawcityWeather();