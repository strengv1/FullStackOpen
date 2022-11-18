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
                value="show" 
                style={{ marginLeft:"5px"}}
                onClick={() => handleShowClick(idx)}
              ></input> 
            </div> 

            <div className={"info"}
                style={{display: infosToShow[idx] ? 'block' : 'none'}}>
              <Country country={country}/>
            </div>
          </div>

      )}
    </div>  
  )
}

const Countries = ({ countriesToShow }) => {
  
  if (countriesToShow.length > 10) {
    return ( 
      <div>
        Too many matches, specify another filter
      </div>  )
  } else if (countriesToShow.length >= 2) {
    return (
        <ListOfCountries countries={countriesToShow}/>
    )
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
                    margin: "5px", 
                    width: "fit-content" 
                    }}>
        <img src={country.flags.png} 
            alt="flag" 
            style={{ margin:"0px 0px -4px 0px" }}/>
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
