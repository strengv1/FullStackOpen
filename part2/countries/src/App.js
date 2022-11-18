




import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ countriesToShow }) => {
  if (countriesToShow.length > 10) {
    return ( 
      <div>
        Too many matches, specify another filter
      </div>  )
  } else if (countriesToShow.length >= 2) {
    return (
      <div className="countries">
        {countriesToShow.map(
          country => 
            <div key={country.cca2}>
              {country.name.common}
            </div>
        )}
      </div>  )
  } else if (countriesToShow.length === 1) {
    return (
      <div >
        <Country country={countriesToShow[0]}/>
      </div>
     )
  } else {
    return(<div>No country matches the results</div>)
  }
}

const Country = ({ country }) => {
  const languages = Object.values(country.languages)
  const {name, capital, area} = country 
  return (
    <>
      <h2> 
        {name.common}
      </h2>
      <p>
        Capital: {capital[0]} 
        <br/>
        Area: {area}
      </p>
      <h3>Languages:</h3>
      {languages.map(
          lang => 
            <li key={lang}>
              {lang}
            </li>
        )}
      
      <div style={{ border: "solid", 
                    margin:"5px", 
                    width:"fit-content" 
                    }}>
        <img src={country.flags.png} alt="flag" 
                  style={{ 
                    margin:"0px 0px -4px 0px"
                  }}/>
      </div>
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

  const hook = () => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(res => {
        setCountries(res.data)
      }).catch(err => {
        console.log('error: ', err)
      })
  }
  useEffect(hook, [])

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
