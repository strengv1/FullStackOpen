const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const title = response.body.map(r => r.title)
  expect(title).toContain(
    'Miksi testaaminen on helppoa ja kivaa'
  )
})

test('identifying field is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Uusi blogi',
    author: 'Pekka Postaaja',
    url: 'pekkapostaaja.fi',
    likes: 0
  }

  // a blog can be added
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // db has one more blog
  const dbInTheEnd = await helper.blogsInDb()
  expect(dbInTheEnd).toHaveLength(helper.initialBlogs.length + 1)

  // db contains the new blog
  const titles = dbInTheEnd.map(r => r.title)
  expect(titles).toContain('Uusi blogi')
})

afterAll(async () => {
  await mongoose.connection.close()
})