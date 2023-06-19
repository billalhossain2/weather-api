const showMsg = direction => {
  const msgContainer = document.getElementById("weather-info-container");
  if(direction === 'loading'){
    msgContainer.innerHTML = `<img id="spinner" class="text-center d-block" width="80px" height="80px" src="./images/preload.gif" alt="Loading Picture">`
  }else if(direction === 'response-error'){
    msgContainer.innerHTML =  `<h5 class="text-center error-msg">City not found !</h5>`
  }else if(direction === 'success'){
    msgContainer.innerHTML = "";
  }else if(direction === "network-error"){
    msgContainer.innerHTML = `<h5 class="text-center error-msg">Please check your internet connection !</h5>`
  }
}

const getWeatherApi = async (cityName) => {
  const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=cb76c6bffbafea6e98fb1d1191963cf9&units=metric`;
  try {
    showMsg('loading')
    const data = await (await fetch(API_URL)).json();
    showMsg('success')
    data.cod === "404" ? showMsg('response-error') : displayWeather(data);
  } catch (error) {
    showMsg('network-error')
  }
};

//Formate sunTime
const getFormatedSunTime = (sunTime, timezone) => {
  return moment.utc(sunTime, "X").add(timezone, "seconds").format("HH:mm a");
};

const displayWeather = (weatherObj) => {
  const {
    name,
    timezone,
    main: { temp },
    sys: { sunrise, sunset },
    weather,
  } = weatherObj;
  const sunRiseTime = getFormatedSunTime(sunrise, timezone);
  const sunSetTime = getFormatedSunTime(sunset, timezone);

  document.getElementById("weather-info-container").innerHTML = `
  <img src="https://openweathermap.org/img/wn/02d@2x.png" alt="Weather Icon" />
  <h1 id="city">${name}</h1>
  <h2 id="celcious">${temp}</h2>
  <h4 id="status">${weather[0].description}</h4>
  <h5 id="sunrise">Sunrise Time: ${sunRiseTime}</h5>
  <h5 id="sunset">Sunset Time: ${sunSetTime}</h5>
  `;
};

//Event listener
document.getElementById("search-btn").addEventListener("click", function (ev) {
  ev.preventDefault();
  const searchedValue = document.getElementById("search-field").value;

  //Validation for empty input field
  !searchedValue
    ? alert("Please enter your city")
    : getWeatherApi(searchedValue);
});

getWeatherApi("dhaka");
