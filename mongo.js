const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2] 

const url =
  `mongodb+srv://strengv1:${password}@fullstackcluster.s4rppyy.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[3] 
const number = process.argv[4] 

if ((typeof name !== 'undefined') && (typeof number !== 'undefined')){
    const generateId = () => {
        var max = 99999
        var min = 10000
        return Math.floor(Math.random() * (max - min) + min);
    }
    const person = new Person({
        name: name,
        number: number,
        id: generateId(),
    })

    person.save()
        .then(result => {
            console.log(`added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })
} else {
    console.log("phonebook:")
    Person.find({})
        .then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}
    
