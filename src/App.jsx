import { useEffect, useState } from 'react'
import countryService from './services/countries'

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

const JustOneCountry = ({country}) => {
  const langs = Object.values(country.languages)
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital} <br />
      Area: {country.area} </p>
      <h2>Languages</h2>
      <ul>
        {langs.map(lan=><li>{lan}</li>)}
      </ul>
      <img src={country.flags.png} alt="Flag" />
    </>
  )
}

const ListOfCountries = ({list}) =>{

  if(list.length > 10) 
    return <p>Too many matches, specify another filter</p>

  else if(list.length > 1){
    return(
      <ul>
        {list.map(country => 
          <li key={country.name.common}>
            {country.name.common}
          </li>
        )}
      </ul>
    )
  }
  else if (list.length === 1) {
    return (<JustOneCountry country={list[0]}/>)
  }
  else return
}

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')

  //Gets all countries and stores them in allCountries
  const getListFromServer = () => {
    countryService.getAll()
    .then(countries => {
      setAllCountries(countries)
      console.log('got all!')
    })
  }

  const handleFilterChange = (event) =>{
    setNewFilter(event.target.value)
  }

  //Returns a list with the filtered countries to show
  const getCountriesToShow = () =>{
    if(newFilter === '') return allCountries
    else return allCountries.filter(country =>{
      const name = country.name.common
      const strToCompare = name.substring(0,newFilter.length)
      return strToCompare.toUpperCase() === newFilter.toUpperCase()
    })
  }

  //Calls for the first time to get all countries
  useEffect(getListFromServer,[])

  return (
    <>
      <SearchBar filter={newFilter} changeHandler={handleFilterChange} />
      <ListOfCountries list={getCountriesToShow()}/>
    </>
  )
}

export default App
