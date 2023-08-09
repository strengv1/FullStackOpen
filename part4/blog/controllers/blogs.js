const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { isValidObjectId } = require('mongoose')
const jwt = require('jsonwebtoken')

// Get all
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

const getTokenFromRequest = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('bearer ')) {
    return authorization.replace('bearer ', '')
  }
  return null
}

// Create new
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!('title' in body) || !('url' in body)){
    return response.status(400).end()
  }
  const decodedToken = jwt.verify(getTokenFromRequest(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  try {
    const blog = new Blog({
      title: body.title,
      author: body.author || '',
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })
    const savedBlog = await blog.save()
    // Add this blog to user's blogs
    if (savedBlog) {
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
    }

    response.status(201).json(savedBlog)
  } catch (err) {
    return response.status(400).json({ error: err.message }).end()
  }
})

async function deleteBlogFromUserDb(blog) {
  const user = await User.findById(blog.user)
  if (user) {
    user.blogs = user.blogs.filter(b => b.toString() !== blog.id)
    await user.save()
  }
}

blogsRouter.delete('/:id', async (request, response) => {
  // Check for a valid mongoose _id. NOTE: Does not check if id exists in database
  if (!isValidObjectId(request.params.id)) {
    return response.status(404).json({ error: 'Invalid id' }).end()
  }
  try {
    const blog = await Blog.findById(request.params.id)
    await Blog.deleteOne(blog)

    deleteBlogFromUserDb(blog)

    response.status(204).end()
  } catch(err){
    return response.status(400).json({ error: err.message })
  }
})

// Update likes
blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  if (!isValidObjectId(id)) {
    return response.status(404).end()
  }

  const body = request.body
  const updatedBlog =
  await Blog.findByIdAndUpdate( id,
    { likes: body.likes },
    { new: true }
  )

  if (updatedBlog) {
    response.status(200).json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter