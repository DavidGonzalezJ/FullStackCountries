import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

//Gets all countries in the server
const getAll = () => {
    const request = axios.get(`${baseUrl}all`)
    return request.then(response => response.data)
}

//Gets one concrete country
const getCountry = ({name}) => {
    const request = axios.get(`${baseUrl}name/${name}`)
    return request.then(response => response.data)
}

export default { getAll, getCountry }