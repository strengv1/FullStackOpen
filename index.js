
const express = require('express')
const app = express()

app.use(express.json())

let phonebook = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
  ]

// Homepage
app.get('/', (req, res) => {
    res.send('<h2>Phonebook!</h2>')
  })

// info page
app.get('/info', (req, res) => {
    const now = new Date();
    const html = `
        <p>Phonebook has info for ${phonebook.length} people</p>\n
        <p>${now}</p>
    `
    res.send(html)
})

// API-page
app.get('/api/phonebook', (req, res) => {
    res.json(phonebook)
})
app.get('/api/phonebook/:id', (request, response) => {
    const id = Number(request.params.id)
    const personObj = phonebook.find(person => person.id === id)
    console.log(personObj)
    if (personObj) {
        response.json(personObj)
    } else {
        response.status(404).end() 
    }
})

app.delete('/api/phonebook/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)
  
    response.status(204).end()
  })  
  
// Start the server
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})