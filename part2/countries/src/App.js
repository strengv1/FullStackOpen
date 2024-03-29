import { useState, useEffect } from 'react'
import axios from 'axios'

const ListOfCountries = ({ countries }) => {
  // Create array that is same length as "countries", fill it with false's
  const [infosToShow, setInfosToShow] = useState(
    new Array(countries.length).fill(false)
  )

  // When clicked, toggle the state of the boolean in that index
  const handleShowClick = (index) => {
    const newInfosToShow = [...infosToShow]
    newInfosToShow[index] = !newInfosToShow[index]
    setInfosToShow(newInfosToShow)
  }
    
  return (
    <div className="countries">
      {countries.map(
        (country, idx) => 
          <div key={country.cca2} className={"country " + country.cca2}>
            <div>
              {country.name.common}
              <input 
                type="button"
                className="button" 
                value={infosToShow[idx] ? 'hide' : 'show' }
                style={{ marginLeft:"5px"}}
                onClick={() => handleShowClick(idx)}
              ></input> 
            </div> 

            <div className={"info"}
                style={{display: infosToShow[idx] ? 'block' : 'none'}}>
              <Country country={country} loneCountry={null}/>
            </div>
          </div>
      )}
    </div>  
  )
}

const Countries = ({ countriesToShow }) => {
  
  if (countriesToShow.length > 10) {
    return ( <div> Too many matches, specify another filter</div> )
  } else if (countriesToShow.length >= 2) {
    return ( <ListOfCountries countries={countriesToShow}/> )
  } else if (countriesToShow.length === 1) {
    return ( <Country country={countriesToShow[0]} loneCountry={countriesToShow[0]}/> )
  } else {
    return( <div>No country matches the results</div> )
  }
}

const Weather = ({ country, data }) => {
  let temp = data.main.temp - 273.15
  let feelsLike = data.main.feels_like - 273.15
  let windSpeed = data.wind.speed
  let icon = data.weather[0].icon
  return(
    <>
      <h2>Weather in {country.capital}</h2>
      <div>
        {/* How to round to 2 decimals in JS: */}
        <p>Temperature: {Math.round((temp + Number.EPSILON) * 100) / 100} Celcius</p>
        <p>Feels like: {Math.round((feelsLike + Number.EPSILON) * 100) / 100} Celcius</p>
        <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt="img"></img>
        <p>Wind: {Math.round((windSpeed + Number.EPSILON) * 100) / 100} m/s</p>
      </div>
    </>
  )
}
// country has country's data; loneCountry is null if this is part of a list
const Country = ({ country, loneCountry }) => {
  const apiKey = process.env.REACT_APP_API_KEY
  const [weatherData, setWeatherData] = useState(null)

  // Fetch weather data every time only 1 country is visible
  useEffect(() => {
    if (loneCountry != null) {
      let lat = country.latlng[0]
      let lon = country.latlng[1]
      
      axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => {
          setWeatherData(response.data.list[0])
        })
        .catch(err =>{
          console.log(err)
        })
      }
  }, [loneCountry, apiKey, country])

  const languages = Object.values(country.languages)
  const {name, capital, area} = country 
  return (
    <>
      <h2>{name.common}</h2>
      <p>Capital: {capital ? capital[0] : 'Undef'}</p>
      <p>Area: {area ? area : 'Undef'}</p>
      <h3>Languages:</h3>
      <ul>
        {languages.map(
          lang => 
            <li key={lang}>
              {lang}
            </li>
        )}
      </ul>
      <div style={{ border: "solid", 
                    margin: "5px", 
                    width: "fit-content" 
                    }}>
        <img src={country.flags.png} 
            alt="flag" 
            style={{ margin:"0px 0px -4px 0px" }}/>
      </div>

      {/* if weatherData has something in it, render weather */} 
      {weatherData != null && <Weather country={country} data={weatherData}/>}
    </>
  )
}

const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <div>
      Find countries <input value={newFilter} onChange={handleFilterChange} />
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const handleFilterChange = (e) => { 
    setNewFilter(e.target.value) 
  }

  // Fetch list of countries when rendering for the 1st time
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(res => {
        setCountries(res.data)
      }).catch(err => {
        console.log('error: ', err)
      })
  }, [])


  const countriesToShow = countries.filter(
    country => country.name.common
      .toLowerCase()
      .includes( newFilter.toLowerCase() )
  )

  return (
    <>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <Countries countriesToShow={countriesToShow}/>
    </>
  )
}

export default App;
