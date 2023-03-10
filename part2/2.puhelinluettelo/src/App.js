import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message, color }) => {
  const colorStyle = {color: color}
  if (message === null || message==='') {
    return null
  }

  return (
    <div style={colorStyle} className="notification">
      {message}
    </div>
  )
}

const Person = ({name, number, id, removePerson}) => {
  return (
  // Woah, the key attribute does NOT have to be added to the div?
  // or addressed in any way here.. 
    <div> 
      {name} {number} <button id={name} onClick={() => removePerson(id)}>Delete</button>
    </div>
  )
}

const Persons = ({personsToShow, removePerson}) => {
  return (
    <div>
      {personsToShow.map(
        person => 
            <Person key={person.name} name={person.name} number={person.number} id={person.id} removePerson={removePerson}/>
      )}
    </div>
   )
}
const Filter = ({newFilter, handleFilterChange}) => {
  return (
    <div>
      filter shown with <input value={newFilter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ persons, setPersons, showNotification }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const handleNameChange = (e) => { setNewName(e.target.value) }
  const handleNumberChange = (e) => { setNewNumber(e.target.value) }

  const updatePerson = id => {
    const person = persons.find(n => n.id === id)
    const updatedPerson = { ...person, number: newNumber }
    
    personService
      .update(id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')

        showNotification(`Changed ${returnedPerson.name}'s number succesfully`, false)
      })
      .catch(error => {
        showNotification(`Information of ${person.name} has already been removed from the server`, true)
        console.log(`Error: ${error}`)
      })
  }

  const addPerson = (e) => {
    e.preventDefault()
    const foundPersons = persons.find( person => person.name === newName)
    if ( foundPersons ) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        updatePerson(foundPersons.id)
      }
    } else {
      const personObj = {
        name: newName,
        number: newNumber
      }

      personService
        .create(personObj)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')

          showNotification(`Added ${returnedPerson.name}`, false)
      })
      .catch(error => {
        showNotification(`Something went wrong`, true)
        alert(`Error: ${error}`)}
      )
    }
  }

  return(
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/> 
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const handleFilterChange = (e) => { setNewFilter(e.target.value) }
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationColor, setNotificationColor] = useState('green')

  const showNotification = (msg, isError) => {
    setNotificationColor(isError ? 'red' : 'green')
    setNotificationMessage(msg)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const removePerson = (id) => {
    const removeThis = persons.find( person => person.id === id)
    if (!( removeThis ) ) {
      alert(`${removeThis.name} not found in the phonebook`)
    } else {
      if ( window.confirm(`Are you sure you want to delete ${removeThis.name} from phonebook?`) ) {
        personService
          .remove(id)
          .catch(error => {
            showNotification(`Something went wrong`, true)
            console.log(`Error: ${error}`)
          })

          showNotification(`${removeThis.name} removed succesfully`, false)
        
        setPersons(
          persons.filter((person) => {
            return person.id !== id;
          })
        )
      }
    }
  }

  const personsToShow = persons.filter(
    person => person.name.toLowerCase().startsWith(newFilter.toLowerCase())
  )

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} color={notificationColor}/>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      
      <h3>Add a new</h3>      
      <PersonForm persons={persons} setPersons={setPersons} showNotification={showNotification}/> 
  
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} removePerson={removePerson}/>
    </>
  )
}

export default App