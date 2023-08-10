const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  await Blog.updateMany({}, { $set:{ user: user._id } })
})

async function virtualLogin(username) {
  const user = await User.findOne({ username })

  const userForToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
  return token
}

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
    test('a valid blog can be added with a logged in user', async () => {
      const newBlog = {
        title: 'Uusi blogi',
        author: 'Pekka Postaaja',
        url: 'pekkapostaaja.fi',
        likes: 0
      }

      const token = await virtualLogin('root')
      // a blog can be added
      await api
        .post('/api/blogs')
        .set({ Authorization: 'bearer '+ token })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // db has one more blog
      const dbInTheEnd = await helper.blogsInDb()
      expect(dbInTheEnd).toHaveLength(helper.initialBlogs.length + 1)

      // db contains the new blog
      const titles = dbInTheEnd.map(r => r.title)
      expect(titles).toContain('Uusi blogi')

      // blog was added to the logged in user
      const addedBlog = dbInTheEnd.slice(-1)[0]
      const usersInTheEnd = await helper.usersInDb()
      expect(usersInTheEnd[0].blogs[0].toString()).toEqual( addedBlog.id )
    })

    test('value of likes defaults to 0', async () => {
      const blogWithNoLikesDefined = {
        title: 'No likes',
        author: 'Pekka Postaaja',
        url: 'pekkapostaaja.fi',
      }

      const token = await virtualLogin('root')
      await api
        .post('/api/blogs')
        .set({ Authorization: 'bearer ' + token })
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
      const token = await virtualLogin('root')
      await api
        .post('/api/blogs')
        .set({ Authorization: 'bearer ' + token })
        .send(blogWithoutTitle)
        .expect(400)

      await api
        .post('/api/blogs')
        .set({ Authorization: 'bearer ' + token })
        .send(blogWithoutUrl)
        .expect(400)

      // db has same amount of blogs as in the beginning
      const dbInTheEnd = await helper.blogsInDb()
      expect(dbInTheEnd).toHaveLength(helper.initialBlogs.length)
    })
    test('POST without a token returns 401', async () => {
      const newBlog = {
        title: 'Ei mene läpi',
        author: 'Teemu Tokeniton',
        url: 'tokenitonelama.fi'
      }

      // a blog can be added
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      // db stays the same
      const dbInTheEnd = await helper.blogsInDb()
      expect(dbInTheEnd).toHaveLength(helper.initialBlogs.length)
    })
    test('POST with a wrong token returns 401', async () => {
      const newBlog = {
        title: 'Ei mene läpi',
        author: 'Vermu Väärentäjä',
        url: 'vaarennettytoken.fi'
      }
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

      // a blog can be added
      await api
        .post('/api/blogs')
        .set({ Authorization: 'bearer ' + token })
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      // db stays the same
      const dbInTheEnd = await helper.blogsInDb()
      expect(dbInTheEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('unauthorized deletion returns 401', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: 'bearer ' + token })
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength( helper.initialBlogs.length )

      const titles = blogsAtEnd.map( r => r.title )
      expect(titles).toContain( blogToDelete.title )
    })

    test('a blog can be deleted, and returns 204 when logged in with the right user', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const user = await User.findOne(blogToDelete.user)
      const token = await virtualLogin(user.username)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: 'bearer ' + token })
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)
      expect(titles).not.toContain(blogToDelete.title)
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