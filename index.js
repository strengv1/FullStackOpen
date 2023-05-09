const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', 
    (req) => JSON.stringify(req.body)
)

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

let persons = [
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
        <p>Phonebook has info for ${persons.length} people</p>\n
        <p>${now}</p>
    `
    res.send(html)
})


// API-page
app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personObj = persons.find(person => person.id === id)
    console.log(personObj)
    if (personObj) {
        response.json(personObj)
    } else {
        response.status(404).end() 
    }
})

// Delete person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})  
  
// Add new person
const generateId = () => {
    var max = 99999
    var min = 10000
    return Math.floor(Math.random() * (max - min) + min);
}
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || (!body.number) ) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    persons = persons.concat(person)
    response.json(person)
})


// Start the server
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})