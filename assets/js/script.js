
const API_KEY = '#################';
const API_URL = 'https://api.weatherapi.com/v1';

const backgroundImg = document.getElementById('main-container');
const searchBar = document.getElementById('search');
const searchBtn = document.getElementById('btn-search');
const weatherIcon = document.getElementById('img');
const currTemp = document.getElementById('temperature');
const condition = document.getElementById('condition');
const currLocation = document.getElementById('location');
const currTime = document.getElementById('time');
const wind = document.getElementById('wind');
const sunrise = document.getElementById('sunrise');
const uvIndex = document.getElementById('uv-index');
const sunset = document.getElementById('sunset');
const wrapper = document.getElementById('wrapper');

document.addEventListener('DOMContentLoaded', function () {
    getWeather('Dublin');
    changeBackground();
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let locationValue = searchBar.value ? searchBar.value.trim() : 'Dublin';
    getWeather(locationValue);
    changeBackground();
});

async function getWeather(loc) {
    const response = await fetch(
        `${API_URL}/forecast.json?key=${API_KEY}&q=$${loc}&days=1&aqi=no&alerts=no`,
    );
    const data = await response.json();
    if (response.ok) {
        showData(data);
    } else {
        showExeption(data.error.code);
        throw new Error(data.error.code);
    }
}

function showData(data) {
    weatherIcon.style.backgroundImage = `url('https:${data.current.condition.icon}')`;
    currTemp.innerText = data.current.temp_c;
    condition.innerText = data.current.condition.text;
    currLocation.innerText = `${data.location.name}, ${data.location.country}`;
    currTime.innerText = data.location.localtime.substring(11);
    wind.innerText = data.current.wind_kph;
    sunrise.innerText = data.forecast.forecastday[0].astro.sunrise;
    uvIndex.innerText = data.current.uv;
    sunset.innerText = data.forecast.forecastday[0].astro.sunset;
}

function showExeption(errorCode) {
    const errorDescriptions = {
        1002: 'API key not provided.',
        1003: "Parameter 'q' not provided.",
        1005: 'API request URL is invalid.',
        1006: "No location found matching parameter 'q'.",
        2006: 'API key provided is invalid.',
        2007: 'API key has exceeded calls per month quota.',
        2008: 'API key has been disabled.',
        2009: 'API key does not have access to the resource. Please check the pricing page for what is allowed in your API subscription plan.',
        9000: 'JSON body passed in the bulk request is invalid. Please make sure it is valid JSON with UTF-8 encoding.',
        9001: 'JSON body contains too many locations for the bulk request. Please keep it below 50 in a single request.',
        9999: 'Internal application error.',
    };

    const errorDescription = errorDescriptions[errorCode] || 'Unknown error occurred';
    wrapper.innerHTML = `<h1>${errorDescription} Try again</h1>`;
}

function changeBackground() {
    let location = currLocation.innerText;
    let currCondition = condition.innerText;
    let imgUrl = `url('https://source.unsplash.com/random/?${location},${currCondition}, nature, town')`;

    backgroundImg.style.backgroundImage = imgUrl;
}
