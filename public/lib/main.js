//API KEY
const key = "cac67298b97190e436286c4e1500ac73";
const buttonArray = document.querySelector(".main__button");
var array = [];
// Get the modal
let modal = document.getElementById("header__submit");    
// Modal opener and closer
let btn = document.getElementById("button");
let span = document.getElementsByClassName("header__submit_close")[0];
 
btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Geolocation starts
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(displayLocationInfo);
}

function displayLocationInfo(position) {
  const lng = position.coords.longitude;
  const lat = position.coords.latitude;
  weatherBalloon(lat, lng);
}

// Get current location if correct draw it
function weatherBalloon(lat,lng) {
  fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=' + key + '&units=metric')  
  .then(function(resp) { return resp.json() }) // Convert data to json
  .then(function(data) {
    let maxcelcius = data.main.temp_max;
    let mincelcius = data.main.temp_min;
    let iconCode = data.weather[0].icon;
    const container = document.querySelector('.current_location');

    document.querySelector(".current_location").innerHTML += `
      <h2 class="current_location__title">Current Location -</h2>
      <h2 class="current_location__title-name">${data.name}</h2>
      <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" class="current_location__icon">
      <p class="current_location__temp">${maxcelcius}&#8451;</p>
      <p class="current_location__temp">${mincelcius}&#8451;</p>
      `;
  })
  .catch(function() {
  });
}

// Delete all city's
let deleteLocal = document.querySelector('.current_location__delete');
 deleteLocal.addEventListener("click", function() {
   localStorage.clear();
   location.reload();
});

// Local storage
localStorage = window.localStorage;

// If city added
buttonArray.addEventListener("click", function() {
  let boxvalue = document.querySelector('.main__search').value;
  localStorage.setItem("cityNames-" + boxvalue, boxvalue);
  location.reload();
})

// Loop and draw city's
function drawcityWeather() {
  for (i = 0; i < localStorage.length; i++) {
  
      array.push(localStorage.key(i));
    
    const container = document.querySelector(".locations");
    let localnames = localStorage.key(i);
    localnames = localnames.replace(/ /g,"");

    container.innerHTML += `
      <section ondrop="drop(event)" ondragover="allowDrop(event)" class="location locations__item ${localStorage.key(i)}">
      </section>
      `;
    let currentI = localStorage.getItem(localStorage.key(i));
    console.log(currentI);
    // Fetch api
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${currentI}&appid=${key}&units=metric`)
    .then(result => {
      // Remove from local storage if invalid
      if (result.status !== 200) {
        localStorage.removeItem("cityNames-" + currentI);
        location.reload();
      }

      // If valid
      return result.json();
    }).then(result => {
        namespace = result.name.replace(/ /g,"");
        const container = document.querySelector('.cityNames-' + namespace);
        let maxcelcius = result.main.temp_max;
        let mincelcius = result.main.temp_min;
        let iconCode = result.weather[0].icon;

        container.innerHTML += `
        <div id="${namespace}" draggable="true" ondragstart="drag(event)">
        <input type="image" src="../images/trashcan.png" data-city="${currentI}" class="location__delete">
          <h2 class="location__title">${namespace}</h2>
          <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" class="location__icon">
          <p class="location__temp">Max temp ${maxcelcius}&#8451;</p>
          <p class="location__temp">Min temp ${mincelcius}&#8451;</p>
        </div>
          `;
        
          removeCity();
    })
  }
}

// Delete button
function removeCity(){ 
  let deleteButton = document.querySelectorAll(".location__delete");
  for (a = 0; a < deleteButton.length; a++) {
      deleteButton[a].addEventListener('click', function () {
          let data = this.getAttribute('data-city');
          localStorage.removeItem("cityNames-" + data);
          location.reload();
      })
  }
}

// Drag and Drop
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("src", ev.target.id);
}

function drop(ev) {
  //array = JSON.parse(localStorage.getItem(localStorage.key(i)));

  console.log(array); //[1, 2, 3]

  ev.preventDefault();
  var src = document.getElementById(ev.dataTransfer.getData("src"));
  var srcParent = src.parentNode;
  var tgt = ev.currentTarget.firstElementChild;

  

  ev.currentTarget.replaceChild(src, tgt);
  srcParent.appendChild(tgt);

  let srcId = src.getAttribute("id");
  let tgtId = tgt.getAttribute("id");

  let srcId2 = "cityNames-" + srcId;
  let tgtId2 = "cityNames-" + tgtId;
  console.log(srcId2);
  let a = array.indexOf(srcId2);
  let b = array.indexOf(tgtId2);
  console.log(a);
  console.log(b);

  classjea = document.querySelector("." + srcId2);
  classjeb = document.querySelector("." + tgtId2);
  
  classjea.className = "location locations__item " + tgtId2;
  classjeb.className = "location locations__item " + srcId2;

  array[a] = tgtId2;
  array[b] = srcId2;
  console.log(array);
  for (i = 0; i < array.length; i++) {
    localStorage.setItem(array[i], array[i].replace("cityNames-", ""));
  }
  // location.reload();
}
//localStorage.clear();
drawcityWeather();