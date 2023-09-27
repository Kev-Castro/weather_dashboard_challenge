let api_key = '92152524767214bbbc6626af17e24b24';
let city = 'atlanta'
var searchHistory = [];
var searchFormEl = document.querySelector('#search-form');
var searchInputEl = document.querySelector('#search-input');
var todayContainerEl = document.querySelector('#today');
var forecastContainerEl = document.querySelector('#forecast');
var searchHistoryContainerEl = document.querySelector('#history');

function renderSearchHistory() {
    searchHistoryContainerEl.innerHTML = '';

    for (let i = searchHistory.length - 1; i >= 0; i--) {
        let cityBtnEl = document.createElement('button');
        cityBtnEl.setAttribute('type', 'button');
        cityBtnEl.setAttribute('aria-controls', 'today forecast');
        cityBtnEl.classList.add('history-btn', 'btn-history');

        // `data-search` allows access to city name when click handler is invoked
        cityBtnEl.setAttribute('data-search', searchHistory[i]);
        cityBtnEl.textContent = searchHistory[i];
        searchHistoryContainerEl.append(cityBtnEl);
    }
}
function init() {
    var storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}

function appendCityToHistory(city) {
    if (searchHistory.indexOf(city) !== -1) {
        return;
    }
    searchHistory.push(city);

    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();
}

function fetchWeather(city) {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${api_key}&units=imperial`)
        .then(function (res) {
            // Send the parsed json data to the next .then() in the chain    
            return res.json();
        }).then(function (data) {
            let i = 0;
            // Loop over forecast array 
            data.list.forEach(function (chunk) {
                // Get the date of the current forecast 3-hour chunk
                var forecastDate = dayjs(chunk.dt_txt);
                // Get the current date from your computer
                var currentDate = dayjs();

                // Condition to check against if the current chunk date(day of month) is today's date - This will avoid data for today and only give us the next 5 days
                if (forecastDate.date() !== currentDate.date()) {
                    // Get the hour from the current forecast 3-hour chunk
                    var hour = forecastDate.hour();

                    // Check if the hour is noon
                    if (hour === 12) {
                        // Do what you need with the noon forecast chunk
                        console.log(chunk);
                        if (i == 0) {
                            renderTodaysWeather(city, chunk);
                            appendCityToHistory(city)
                        }
                        i++;
                        renderForcast(chunk)
                    }
                }
            })
        })
}

function renderTodaysWeather(city, chunk) {
    let date = dayjs().format('M/D/YYYY');
    let tempF = chunk.main.temp;
    console.log('tempF = ', tempF)
    let windSpeed = chunk.wind.speed;
    let humidity = chunk.main.humidity;
    let icon = `https://openweathermap.org/img/w/${chunk.weather[0].icon}.png`;
    let iconDescription = chunk.weather[0].description || weather[0].main;

    let cardEl = document.createElement('div');
    let cardBodyEl = document.createElement('div');
    let headingEl = document.createElement('h2');
    let weatherIconEl = document.createElement('img');
    let tempEl = document.createElement('p');
    let windEl = document.createElement('p');
    let humidityEl = document.createElement('p');

    cardEl.setAttribute('class', 'card');
    cardBodyEl.setAttribute('class', 'card-body');
    cardEl.append(cardBodyEl);

    headingEl.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    headingEl.textContent = `${city} (${date})`;
    weatherIconEl.setAttribute('src', icon);
    weatherIconEl.setAttribute('alt', iconDescription);
    weatherIconEl.setAttribute('class', 'weather-img');
    headingEl.append(weatherIconEl);
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBodyEl.append(headingEl, tempEl, windEl, humidityEl);

    todayContainerEl.innerHTML = '';
    todayContainerEl.append(cardEl);
}
function renderForcast(chunk) {
    let tempF = chunk.main.temp;
    console.log('tempF = ', tempF)
    let windSpeed = chunk.wind.speed;
    let humidity = chunk.main.humidity;
    let icon = `https://openweathermap.org/img/w/${chunk.weather[0].icon}.png`;
    let iconDescription = chunk.weather[0].description || weather[0].main;

    let colEl = document.createElement('div');
    let cardEl = document.createElement('div');
    let cardBodyEl = document.createElement('div');
    let cardTitleEl = document.createElement('h4');
    let weatherIconEl = document.createElement('img');
    let tempEl = document.createElement('p');
    let windEl = document.createElement('p');
    let humidityEl = document.createElement('p');

    colEl.append(cardEl);
    cardEl.append(cardBodyEl);
    cardBodyEl.append(cardTitleEl, weatherIconEl, tempEl, windEl, humidityEl);

    colEl.setAttribute('class', 'col-md');
    colEl.classList.add('five-day-card');
    cardEl.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBodyEl.setAttribute('class', 'card-body p-2');
    cardTitleEl.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    colEl.setAttribute('class', 'col-md');
    colEl.classList.add('five-day-card');
    cardEl.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBodyEl.setAttribute('class', 'card-body p-2');
    cardTitleEl.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    cardTitleEl.textContent = dayjs(chunk.dt_txt).format('M/D/YYYY');
    weatherIconEl.setAttribute('src', icon);
    weatherIconEl.setAttribute('alt', iconDescription);
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windSpeed} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;

    forecastContainerEl.append(colEl);
}

function fetchCoords(city) {
    //TBD
}

function handleSearchHistory(e) {
    if (!e.target.matches('.btn-history')) {
        return;
    }

    let btnEl = e.target;
    city = btnEl.getAttribute('data-search');
    fetchWeather(city);
}

function handleSearch(e) {
    // Don't continue if there is nothing in the search form
    if (!searchInputEl.value) {
        return;
    }

    e.preventDefault();
    city = searchInputEl.value.trim();
    fetchWeather(city);
    searchInputEl.value = '';
}
searchFormEl.addEventListener('submit', handleSearch);
searchHistoryContainerEl.addEventListener('click', handleSearchHistory);
init();