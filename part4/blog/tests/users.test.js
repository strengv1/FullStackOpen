const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'strengv1',
      name: 'Ville Strengell',
      password: 'salasana',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username or password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserNoName = {
      name: 'No Name',
      password: 'salainen',
    }
    const newUserNoPassword = {
      username: 'Username',
      name: 'No password',
    }
    let result = await api
      .post('/api/users')
      .send(newUserNoName)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('`username` is required')

    result = await api
      .post('/api/users')
      .send(newUserNoPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('Password missing')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username or password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserShortName = {
      username: 'ro',
      name: 'Too Short Username',
      password: 'salainen',
    }
    const newUserShortPassword = {
      username: 'root',
      name: 'Too Short Password',
      password: 'sh',
    }

    let result = await api
      .post('/api/users')
      .send(newUserShortName)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('at least 3 characters')

    result = await api
      .post('/api/users')
      .send(newUserShortPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('at least 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})