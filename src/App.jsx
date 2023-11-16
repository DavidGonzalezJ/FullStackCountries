import { useEffect, useState } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

//Component that renders the weather
const Weather = ({capital, weather}) => {
  if(weather === null) return 
  const iconCode = weather.weather[0].icon
  const temp = weather.main.temp - 273.15
  return(
    <div>
      <h2>Weather in {capital}</h2>
      <p>Temperature: {Math.round(temp)}º Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${iconCode}.png`}
        alt="WeatherIcon" />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  )
}

//Component that renders the searchbar
const SearchBar = ({filter, changeHandler}) => {
  return(
    <div>
      Find countries
      <input id='search'
       type="text"
       value={filter}
       onChange={changeHandler} />
    </div>
  )
}

//Component that renders one country
const JustOneCountry = ({country, weather}) => {
  const langs = Object.values(country.languages)
    return (
      <>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital} <br />
        Area: {country.area} </p>
        <h2>Languages</h2>
        <ul>
          {langs.map(lan=><li key={lan}>{lan}</li>)}
        </ul>
        <img src={country.flags.png} alt="Flag" />
        <Weather capital={country.capital} weather={weather}/>
      </>
    )
}

//Component that renders the list of countries in case there's more than 1
const ListOfCountries = ({list,buttonHandler}) =>{
  if(list.length > 10) 
    return <p>Too many matches, specify another filter</p>

  else 
    return(
      <ul>
        {list.map(country => 
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={()=>buttonHandler(country.name.common)}>show</button>
          </li>
        )}
      </ul>
    )
}

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [newWeather, setNewWeather] = useState(null)
  const [countryToShow, setNewCountry] = useState(null)

  let justOne = false

  //Gets all countries and stores them in allCountries
  const getListFromServer = () => {
    countryService.getAll()
    .then(countries => {
      setAllCountries(countries)
      console.log('got all!')
    })
  }

  //Gets weather info for a country
  const getWeatherInfo = () =>{
    if(countryToShow === null) return

    const latlong = countryToShow.latlng
    weatherService.getWeather(latlong[0],latlong[1])
    .then(weather => {
      setNewWeather(weather)
      console.log('we got the weather!')
    })
  }


  //Returns a list with the filtered countries to show
  const getCountriesToShow = () =>{
    if(newFilter === ''){
      if(countryToShow !== null) setNewCountry(null)
      return allCountries
    }
    else{
      const countriesToShow = allCountries.filter(country =>{
        const name = country.name.common
        const strToCompare = name.substring(0,newFilter.length)
        return strToCompare.toUpperCase() === newFilter.toUpperCase()
      })
      if (countriesToShow.length === 1){
        justOne = true
        if(countryToShow === null) setNewCountry(countriesToShow[0])
      }
      else
        if(countryToShow !== null) setNewCountry(null)
      return countriesToShow
    }
  }

  //Handles the search bar changes
  const handleFilterChange = (event) =>{
    setNewFilter(event.target.value)
  }

  //Handle for the show button
  const handleShowCountry = (countryName) => {
    setNewFilter(countryName)
  }

  //Calls for the first time to get all countries
  useEffect(getListFromServer,[])
  useEffect(()=>getWeatherInfo(countryToShow),[countryToShow])

  const countryList = getCountriesToShow()
  if(!justOne)
  return(
    <>
      <SearchBar filter={newFilter} changeHandler={handleFilterChange} />
      <ListOfCountries list={countryList} buttonHandler={handleShowCountry}/>
    </>
  )

  else
  return(
    <>
      <SearchBar filter={newFilter} changeHandler={handleFilterChange} />
      <JustOneCountry country={countryToShow} weather={newWeather}/>
    </>
  )
}

export default App
