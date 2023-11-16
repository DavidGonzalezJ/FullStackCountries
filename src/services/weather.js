import axios from 'axios'

//Gets all countries in the server
const getWeather = (lat,lon) => {
    const APIkey = import.meta.env.VITE_SOME_KEY
    const request = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`)
    return request.then(response => response.data)
}

export default { getWeather }