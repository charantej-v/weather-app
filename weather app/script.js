// date function

function  dateformat(timestamp){
    const date =new Date(timestamp * 1000);
    console.log(date.toUTCString());
    console.log(date.toLocaleString());
    return date.toLocaleString();
}

async function fetchdata() {
    let cityName = document.getElementsByClassName('searchinput')[0].value;
    console.log('Current City: ', cityName);

    let requestdata = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=8ca451bd3fe32bcd7dfa776559106ba8&units=metric`);
    let formatdata = await requestdata.json();
    console.log("format Data: ", formatdata);
    //assigning the city name
    let responseCityName=formatdata.name;
    document.getElementById('cityname').innerText= responseCityName;
    console.log('Response In City Name:' ,responseCityName);

    //assiging temperature
    let responseTemp=formatdata.main.temp;
    console.log(responseTemp);
    document.getElementById('citytemp').innerText = responseTemp;
    //assigning sky description
    
    let skyDescription=formatdata.weather[0].description;
    console.log('skydescription',skyDescription);
    document.getElementById('skydescription').innerText = skyDescription;

    // assigning the right side row one values


    document.getElementById("humidity").innerText = formatdata.main.humidity;
    document.getElementById("Pressure").innerText = formatdata.main.pressure;
    document.getElementById("feelslike").innerText = formatdata.main.feels_like;
    document.getElementById("visibility").innerText = formatdata.visibility;


    // date and time
    let properDate = dateformat(formatdata.dt);
    console.log('the date and time: ',properDate );
    let date = properDate.split(',')[0];
    let time = properDate.split(',')[1];
    console.log('date & time: ',date,time);


   
    // assigning date and time to the text


    document.getElementById('date').innerText = date;
    document.getElementById('time').innerText = time;



    // updating sunrise and sunset values



    let sunriseTimeStamp = formatdata.sys.sunrise;
    let sunsetTimeStamp = formatdata.sys.sunset;

    let propersunriseTime = dateformat(sunriseTimeStamp);
    console.log("sunrise  time: ",propersunriseTime);
    let propersunsetTime = dateformat(sunsetTimeStamp);
    console.log("sunset  time: ",propersunsetTime);

    document.getElementById('sunrise').innerText = propersunriseTime;
    document.getElementById('sunset').innerText = propersunsetTime;

    // latitude and longitude data
    let lat = formatdata.coord.lat;
    let lon = formatdata.coord.lon;
    fetchaqidata(lat,lon);
   

    
   
    

    
}
async function fetchaqidata(lat,lon) {
    let fetchaqidata = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=8ca451bd3fe32bcd7dfa776559106ba8`);
    let formateddata = await fetchaqidata.json();
    console.log('aqi data: ' ,formateddata);
    let list = formateddata.list[0].components;
    console.log("aqi metrics: ",list);

    // asssinging the air mewtrics values


    document.getElementById('co').innerText = 'co';
    document.getElementById('covalue').innerText = list.co;

     document.getElementById('no2').innerText = 'no2';
    document.getElementById('no2value').innerText = list.no2;

     document.getElementById('nh3').innerText = 'nh3';
    document.getElementById('nh3value').innerText = list.nh3;

     document.getElementById('o3').innerText = 'o3';
    document.getElementById('o3value').innerText = list.o3;



// to update teh 5 days data


    async function nextFiveDays(lat, lon) {
    const apiKey = "8ca451bd3fe32bcd7dfa776559106ba8";
    const apiUrl = (`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch weather data");

        const data = await response.json();

        // Extract unique daily data
        let dailyForecasts = {};
        data.list.forEach(item => {
            const date = item.dt_txt.split(" ")[0];
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    temp: item.main.temp.toFixed(1),
                    icon: item.weather[0].icon,
                    day: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
                    date: new Date(date).toLocaleDateString("en-GB") // Format: DD-MM-YYYY
                };
            }
        });

        const forecastArray = Object.values(dailyForecasts).slice(0, 5);

        // Update the HTML elements
        forecastArray.forEach((forecast, i) => {
            const index = i + 1;

            // Update temp, day, and date
            document.getElementById(`temp${index}`).innerHTML = `${forecast.temp} &deg;C`;
            document.getElementById(`day${index}`).innerText = forecast.day;
            document.getElementById(`date${index}`).innerText = forecast.date;

           
            const cloudImages = document.querySelectorAll('#cloudimage img');
            if (cloudImages[i]) {
                cloudImages[i].src = `https://openweathermap.org/img/wn/${forecast.icon}@2x.png`;
                cloudImages[i].alt = forecast.day;
            }
        });

    } catch (error) {
        console.error(error);
        alert("Failed to load weather forecast.");
    }
}


nextFiveDays(lat, lon);

// function to fetch the data every 3 hrs

async function displayTodayWeather(lat, lon) {
  const apiKey = '8ca451bd3fe32bcd7dfa776559106ba8'; // Replace with your actual OpenWeatherMap API key
  const url = (`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    const forecastList = data.list;

    const today = new Date().toISOString().split("T")[0]; // e.g. '2025-08-06'
    const todayForecasts = forecastList.filter(item => item.dt_txt.startsWith(today)).slice(0, 6);

    const forecastElements = document.querySelectorAll(".temptoday");

    todayForecasts.forEach((forecast, index) => {
      const element = forecastElements[index];
      if (element) {
        const time = new Date(forecast.dt_txt).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        const temp = Math.round(forecast.main.temp);
        const icon = forecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        element.innerHTML = `
          <h6>${time}</h6>
          <img src="${iconUrl}" width="25px">
          <h6>${temp} &deg;C</h6>
        `;
      }
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
displayTodayWeather(lat, lon)

}

