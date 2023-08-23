const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { isValidObjectId } = require('mongoose')

// Get all
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Create new
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const user = request.user
  if (!request.token) return response.status(401).json({ error: 'token not found' })

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
    next(err)
  }
})

async function deleteBlogFromUserDb(blog, user) {
  user.blogs = user.blogs.filter(b => b.toString() !== blog.id)
  await user.save()
}

blogsRouter.delete('/:id', async (request, response, next) => {
  // Check for a valid mongoose _id. NOTE: Does not check if id exists in database
  if (!isValidObjectId(request.params.id)) {
    return response.status(400).json({ error: 'Invalid id' }).end()
  }
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    const user = request.user
    const userFromBlog = await User.findById(blog.user)

    if (user && user.id === userFromBlog._id.toString()){
      await Blog.deleteOne(blog)
      await deleteBlogFromUserDb(blog, user)
      response.status(204).end()
    } else {
      response.status(401).json({ error: 'authentication failed' }).end()
    }
  } catch(err){
    next(err)
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
    { title: body.title, likes: body.likes },
    { new: true }
  )

  updatedBlog ? response.status(200).json(updatedBlog) : response.status(404).end()
})

module.exports = blogsRouter