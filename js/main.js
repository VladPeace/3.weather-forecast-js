const API_KEY = '4d0acb5c587ea09e45d027229439b325';

const form = document.querySelector('#weather-form');
const input = document.querySelector('#weather-form__input');

form.onsubmit = submitHandler;

async function submitHandler(e) {
	e.preventDefault();

	if (!input.value.trim()) {
		console.log('Введите название города');
		return;
	}

	const cityName = input.value.trim();
	input.value = '';

	const cityInfo = await getGeo(cityName);

	if (!cityInfo) return;

	const weatherInfo = await getWeather(cityInfo.lat, cityInfo.lon);

	// console.log(weatherInfo.name);
	// console.log(weatherInfo.weather[0].main);

	const weatherData = {
		temp: Math.round(weatherInfo.main.temp),
		name: weatherInfo.name,
		humidity: Math.round(weatherInfo.main.humidity),
		speed: Math.round(weatherInfo.wind.speed),
		main: weatherInfo.weather[0].main
	};

	renderWeatherData(weatherData);
}

async function getGeo(city) {
	const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
	const response = await fetch(geoUrl);
	const data = await response.json();
	return data[0];
}

async function getWeather(lat, lon) {
	const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
	const response = await fetch(weatherUrl);
	const date = await response.json();
	return date;
}

function renderWeatherData(data) {
// Отображаем блоки с информацией
	document.querySelector('.weather__info').classList.remove('none');
	document.querySelector('.weather__details').classList.remove('none');

	// Отображаем данные по погоде
	const temp = document.querySelector('.weather__temp');
	const city = document.querySelector('.weather__city');
	const humidity = document.querySelector('#humidity');
	const speed = document.querySelector('#speed');
	const img = document.querySelector('#weather-img');

	temp.innerText = data.temp + '°C';
	city.innerText = data.name;
	humidity.innerText = data.humidity + '%';
	speed.innerText = data.speed + 'km/h';

	const fileNames = {
		'Clouds': 'clouds',
		'Clear': 'clear',
		'Rain': 'rain',
		'Mist': 'mist',
		'Drizzle': 'drizzle',
		'Snow': 'snow',
	};

	if (fileNames[data.main]) {
		img.src = `./img/weather/${fileNames[data.main]}.png`;
	}


}