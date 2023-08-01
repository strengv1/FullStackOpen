const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
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

  describe('addition of a new blog', () => {
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

    test('value of likes defaults to 0', async () => {
      const blogWithNoLikesDefined = {
        title: 'No likes',
        author: 'Pekka Postaaja',
        url: 'pekkapostaaja.fi',
      }

      await api
        .post('/api/blogs')
        .send(blogWithNoLikesDefined)

      const dbInTheEnd = await helper.blogsInDb()
      const blogWithNoLikes = dbInTheEnd.find(blog => blog.title === 'No likes')
      expect(blogWithNoLikes.likes).toEqual(0)
    })

    test('POST without url or title returns status code 400', async () => {
      const blogWithoutTitle = {
        author: 'Huono postaaja',
        url: 'badposter.fi',
        likes: 2
      }
      const blogWithoutUrl = {
        title: 'Blogi ilman urlia',
        author: 'Huono postaaja',
        likes: 2
      }

      // bad POST returns 400
      await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .expect(400)

      await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400)

      // db has same amount of blogs as in the beginning
      const dbInTheEnd = await helper.blogsInDb()
      expect(dbInTheEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('a blog can be deleted, and returns 204', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).not.toContain(blogToDelete.title)
    })

    test('deleting with invalid id returns 404', async () => {
      await api
        .delete('/api/blogs/invalidId')
        .expect(404)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
      )
    })
  })

  describe('editing a blog', () => {
    test('editing a blog is possible', async () => {
      const database = await helper.blogsInDb()
      const blogToBeEdited = database[0]
      const newBlog = { ...blogToBeEdited, likes: blogToBeEdited.likes + 1 }

      await api
        .put(`/api/blogs/${blogToBeEdited.id}`)
        .send(newBlog)
        .expect(200)

      const dbInTheEnd = await helper.blogsInDb()
      expect(dbInTheEnd[0].likes).toEqual(helper.initialBlogs[0].likes + 1)
    })

    test('editing with invalid id returns 404', async () => {
      const database = await helper.blogsInDb()
      const blogToBeEdited = database[0]
      const newBlog = { ...blogToBeEdited, likes: blogToBeEdited.likes + 1 }

      await api
        .put('/api/blogs/123123123123')
        .send(newBlog)
        .expect(404)
    })
  })
})

test('identifying field is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})


afterAll(async () => {
  await mongoose.connection.close()
})