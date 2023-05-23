require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
    console.log("errorhandler jihuu")
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

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
app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
    .catch(error => next(error))
})

// Get one
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    .catch(error => next(error))
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

// Edit existing person
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})
  
// Delete person
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})  

app.use(errorHandler)

// Start the server
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})