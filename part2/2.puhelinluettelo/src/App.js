import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const handleNameChange = (e) => { setNewName(e.target.value) }
  const handleNumberChange = (e) => { setNewNumber(e.target.value) }
  const handleFilterChange = (e) => { setNewFilter(e.target.value) }
  
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

  const personsToShow = persons.filter(
      person => person.name.toLowerCase().startsWith(newFilter.toLowerCase())
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          filter shown with <input value={newFilter} onChange={handleFilterChange} />
        </div>
        <h2>Add new</h2>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      
      <h2>Numbers</h2>
      {personsToShow.map(
        person => 
          <div key={person.name}> 
            {person.name} {person.number}
          </div>
      )}
    </div>
  )
}

export default App