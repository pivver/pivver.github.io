function getTime() {
  const clock = document.querySelector(".clock");
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  let time;
  if (minutes <= 9) {
    time = `${hours}:0${minutes}`;
  } else {
    time = `${hours}:${minutes}`;
  }

  clock.textContent = time;
}

setInterval(getTime, 100);

function getLocation() {
  const successCallback = (position) => {
    const coords = position.coords;
    const lat = coords.latitude.toFixed(3);
    const long = coords.longitude.toFixed(3);
    // fetch
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyBZ5xIfo_guE1wp66IcjlhI1P3uulS7-u4`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const results = data.results;
        if (results.length > 0) {
          const cityResult = results.find((result) =>
            result.types.includes("locality")
          );
          if (cityResult) {
            const city = cityResult.address_components[0].long_name;
            displayCityName(city);
            fetch(
              `https://api.unsplash.com/search/photos?query=${city}&client_id=${"pFV8-axTjElAzOzf_HqK1UHBoEX53XZSpP6tVd7dzKA"}`
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                const cityPic = data.results[0].urls.full;
                image = document.querySelector(".picture");
                image.style.backgroundImage = `url("${cityPic}")`;
              });
          }
        } else {
          displayCityName("Unknown");
        }
      });

    fetch(
      `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${long}/lat/${lat}/data.json`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("väder", data);
        const currentTemp = data.timeSeries[0].parameters[10].values;
        document.querySelector(".degrees").textContent = currentTemp + "°C";
        document.querySelector(".nowIcon").src = getIcon(
          Number(data.timeSeries[0].parameters[18].values)
        );
        const currentRain = data.timeSeries[0].parameters[3].values;
        document.querySelector(".rain").textContent =
          "Rainfall: " + currentRain + " mm/h";
        const currentAirpressure = data.timeSeries[0].parameters[11].values;
        document.querySelector(".airValueAirpressure").textContent =
          currentAirpressure + " hPa";
        const currentWindspeed = data.timeSeries[0].parameters[14].values;
        document.querySelector(".airValueWindspeed").textContent =
          currentWindspeed + " m/s";
        const currentVisability = data.timeSeries[0].parameters[12].values;
        document.querySelector(".airValueVisability").textContent =
          currentVisability + " km";
        const currentHumidity = data.timeSeries[0].parameters[15].values;
        document.querySelector(".airValueHumidity").textContent =
          currentHumidity + " %";
        let sevenDayForecast = [];
        let weeklyContainer = document.querySelector(".sevenDayForecast");
        sevenDayForecast.forEach((day) => {
          let iconURL = getIcon(Number(day.parameters[18].values));
          weeklyContainer.innerHTML +
            `<div class="daily">
  <p class="daily-title">Monday</p>
  <div class="dailyIcon">
    <img src="sunny.jpg" alt="Weather-Icon" class="7dayIcon" />
    <p class="7dayWeather">Sunny</p>
  </div>
  <div class="dailyMaxMin">
    <p class="max">Max x°</p>
    <p class="min">Min x°</p>
  </div>
</div>
  `;
        });
        let todayForecast = data.timeSeries.slice(0, 6);
        let hourlyContainer = document.querySelector(".hourlyContainer");
        todayForecast.forEach((time) => {
          let iconURL = getIcon(Number(time.parameters[18].values));
          let date = new Date(time.validTime);
          let clock = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          hourlyContainer.innerHTML += `
            <div class="hourly">
              <p class="hourlyTime">${clock}</p>
              <img src="${iconURL}" alt="Weather-Icon" class="hourlyIcon" />
              <p class="hourlyDegrees">${time.parameters[10].values}°</p>
            </div>`;
        });
      });
  };

  const errorCallback = (error) => {
    console.log(error);
  };
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}
function displayCityName(city) {
  document.querySelector(".locationTitle").textContent = city;
}
getLocation();

function getIcon(number) {
  switch (number) {
    case 1:
    case 2:
      return "./img/icons/clear.png";
    case 3:
    case 4:
      return "./img/icons/partly-cloudy.png";

    case 5:
    case 6:
      return "./img/icons/overcast.png";

    case 7:
      return "./img/icons/fog.png";

    case 8:
    case 9:
    case 10:
    case 18:
    case 19:
    case 20:
      return "./img/icons/heavy-rain.png";

    case 11:
    case 21:
      return "./img/icons/storm.png";

    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
      return "./img/icons/snow.png";
  }
}
