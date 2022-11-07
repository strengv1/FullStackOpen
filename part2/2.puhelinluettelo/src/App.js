import { useState } from 'react'
const Person = ({name, number}) => {
  return (
  // Woah, the key attribute does NOT have to be added to the div?
  // or addressed in any way here.. 
    <div> 
      {name} {number}
    </div>
  )
}

const Persons = ({personsToShow}) => {
  return (
    <div>
      {personsToShow.map(
        person => 
          <Person key={person.name} name={person.name} number={person.number} />
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

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const handleNameChange = (e) => { setNewName(e.target.value) }
  const handleNumberChange = (e) => { setNewNumber(e.target.value) }

  const addPerson = (e) => {
    e.preventDefault()
    if ( persons.find( person => person.name === newName) ) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObj = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObj))
      setNewName('')
      setNewNumber('')
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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newFilter, setNewFilter] = useState('')
  const handleFilterChange = (e) => { setNewFilter(e.target.value) }

  const personsToShow = persons.filter(
    person => person.name.toLowerCase().startsWith(newFilter.toLowerCase())
  )

  return (
    <>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      
      <h3>Add a new</h3>      
      <PersonForm persons={persons} setPersons={setPersons}/> 
  
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow}/>
    </>
  )
}

export default App