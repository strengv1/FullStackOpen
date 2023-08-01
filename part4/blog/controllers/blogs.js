const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { isValidObjectId } = require('mongoose')

// Get all
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// Create new
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!('title' in body) || !('url' in body)){
    response.status(400).end()
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author || '',
      url: body.url,
      likes: body.likes || 0
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  // Check for a valid mongoose _id. NOTE: Does not check if id exists in database
  if (!isValidObjectId(id)) {
    return response.status(404).send('Not found')
  }

  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

module.exports = blogsRouter