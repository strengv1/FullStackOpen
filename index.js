require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', 
    (req) => JSON.stringify(req.body)
)

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(express.static('build'))


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

// Get all
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

// Get one
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

// Create new person
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined || (body.number === undefined) ) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// Delete person
app.delete('/api/persons/:id', (request, response) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
  
    // response.status(204).end()
})  


// Start the server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})