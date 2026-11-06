// console.log(data);
// console.log(data.name);
// console.log(data.main.temp);
// console.log(data.weather[0].icon);
// console.log(data.wind.speed);
// console.log(data.main.humidity);

class WeatherApp {
    constructor() {
        this.cityInput = document.querySelector('#city-input');
        this.searchButton = document.querySelector('#search-button');
        this.dataLabel = document.querySelector('#data-label');
        this.weatherWrapper = document.querySelector('#weather-wrapper');
        this.cityTitle = document.querySelector('#city-title');
        this.temperatureSpan = document.querySelector('#temperature');
        this.windSpan = document.querySelector('#wind');
        this.humiditySpan = document.querySelector('#humidity');
        this.weatherImage = document.querySelector('#weather-image');
        this.errorDataDisplay = document.querySelector('#error-data-display');

        this.weatherWrapper.classList.remove('displaying');
        this.weatherWrapper.classList.remove('error');

        this.displayDate();
        this.bindEvents();
    }

    bindEvents() {
        this.searchButton.addEventListener('click', () => {
            this.loadWeather(this.cityInput.value);
        })

        this.cityInput.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            this.loadWeather(this.cityInput.value);
        })

        setInterval(() => {
            this.displayDate()
        }, 1000);

        document.body.addEventListener('click', (e) => {
            if (e.target.closest('.app-card')) return;
            this.clearCard();
        })
    }

    displayDate() {
        const date = new Date();
        this.dataLabel.textContent = 'Today, ' +
            date.getDate() +
            " " +
            date.toLocaleDateString('en-US', {
                month: 'long'
            });
    }

    async loadWeather(cityName) {
        cityName = cityName.trim()
        if (!cityName) return;

        this.searchButton.classList.add('loading');
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${'apikey'}&units=metric`)
            if (response.ok) {
                const data = await response.json();
                this.displayData('weather', data);
            } else {
                this.displayData('error', response.statusText);
            }
        } catch (err) {
            this.displayData('error', err);
        } finally {
            this.searchButton.classList.remove('loading');
        }

    }

    async displayData(type, data) {
        if (
            this.weatherWrapper.classList.contains('displaying') ||
            this.weatherWrapper.classList.contains('error')
        ) {
            this.weatherWrapper.style.maxHeight = '0px';

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        this.weatherWrapper.style.maxHeight = '';

        requestAnimationFrame(() => {
            if (type === 'weather') this.displayWeather(data);
            if (type === 'error') this.displayError(data);
        })
    }

    displayWeather(data) {
        this.weatherWrapper.classList.add('displaying');
        this.weatherWrapper.classList.remove('error');
        this.cityTitle.textContent = data.name;
        this.temperatureSpan.textContent = Math.round(data.main.temp) + '°C';
        this.windSpan.textContent = data.wind.speed + ' m/s';
        this.humiditySpan.textContent = data.main.humidity + '%';
        this.loadWeatherImage(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    }

    loadWeatherImage(src) {
        this.weatherImage.src = src;
        this.weatherImage.style.maxWidth = '0px';
        this.weatherImage.onload = () => {
            this.weatherImage.style.maxWidth = '1000px';
        }
    }

    displayError(errorText) {
        this.weatherWrapper.classList.remove('displaying');
        this.weatherWrapper.classList.add('error');

        this.errorDataDisplay.textContent =
            errorText ?
            "'" + errorText + "' error occured" :
            'Unknown error occured';
    }

    clearCard() {
        this.weatherWrapper.classList.remove('displaying');
        this.weatherWrapper.classList.remove('error');
        this.cityInput.value = '';
    }
}

const weatherApp = new WeatherApp();