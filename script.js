document.getElementById('submit-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherData(city);
    } else {
        displayError('Please enter a city name.');
    }
});

async function fetchWeatherData(city) {
    const apiKey = '8ab164eeef06bf637263f601ab338a5d';  // Replace with your OpenWeatherMap API key
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const aqiApiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat={LAT}&lon={LON}&appid=${apiKey}`;

    try {
        const weatherResponse = await fetch(weatherApiUrl);
        if (!weatherResponse.ok) {
            throw new Error('City not found');
        }
        const weatherData = await weatherResponse.json();

        const { coord: { lat, lon } } = weatherData;
        const aqiResponse = await fetch(aqiApiUrl.replace('{LAT}', lat).replace('{LON}', lon));
        if (!aqiResponse.ok) {
            throw new Error('AQI data not available');
        }
        const aqiData = await aqiResponse.json();

        displayWeatherData(weatherData, aqiData);
    } catch (error) {
        displayError(error.message);
    }
}

function displayWeatherData(weatherData, aqiData) {
    document.getElementById('location').textContent = `Location: ${weatherData.name}, ${weatherData.sys.country}`;
    document.getElementById('temperature').textContent = `Temperature: ${weatherData.main.temp}°C`;
    document.getElementById('description').textContent = `Weather: ${weatherData.weather[0].description}`;
    document.getElementById('humidity').textContent = `Humidity: ${weatherData.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${weatherData.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    document.getElementById('error-message').textContent = '';

    const aqi = aqiData.list[0].main.aqi;
    document.getElementById('aqi').textContent = `AQI: ${aqi}`;
    document.getElementById('air-quality').textContent = `Air Quality: ${getAirQualityDescription(aqi)}`;

    updateBackground(weatherData.weather[0].main);
}

function displayError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('location').textContent = '';
    document.getElementById('temperature').textContent = '';
    document.getElementById('description').textContent = '';
    document.getElementById('humidity').textContent = '';
    document.getElementById('wind-speed').textContent = '';
    document.getElementById('weather-icon').src = '';
    document.getElementById('aqi').textContent = '';
    document.getElementById('air-quality').textContent = '';
    updateBackground('default');
}

function updateBackground(weatherCondition) {
    let imageUrl = 'images/default.jpg';

    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            imageUrl = 'images/sunny.jpg';
            break;
        case 'clouds':
            imageUrl = 'images/cloudy.png';
            break;
        case 'rain':
            imageUrl = 'images/rainy.png';
            break;
        case 'snow':
            imageUrl = 'images/snowy.jpg';
            break;
    }

    document.body.style.backgroundImage = `url('${imageUrl}')`;
}

function getAirQualityDescription(aqi) {
    if (aqi === 1) return 'Good';
    if (aqi === 2) return 'Fair';
    if (aqi === 3) return 'Moderate';
    if (aqi === 4) return 'Poor';
    if (aqi === 5) return 'Very Poor';
    return 'Unknown';
}
