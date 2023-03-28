
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

// Delete person
app.delete('/api/phonebook/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)
  
    response.status(204).end()
})  
  
// Add new person
const generateId = () => {
    var max = 99999
    var min = 10000
    return Math.floor(Math.random() * (max - min) + min);
}
app.post('/api/phonebook', (request, response) => {
    const body = request.body
    if (!body.name || (!body.number) ) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    if (phonebook.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    phonebook = phonebook.concat(person)
    response.json(person)
})


// Start the server
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})