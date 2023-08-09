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

// Create new
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
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
    next(err)
  }
})

async function deleteBlogFromUserDb(blog, user) {
  if (user){
    user.blogs = user.blogs.filter(b => b.toString() !== blog.id)
    await user.save()
  }
}
async function getUserAndAuthenticate(blog, reqToken) {
  const userFromBlog = await User.findById(blog.user)
  const userFromToken = jwt.verify(reqToken, process.env.SECRET)
  const auth = userFromToken.id === userFromBlog._id.toString()

  console.log(userFromBlog)
  console.log(userFromToken.id, '===', userFromBlog._id.toString())

  return { userFromBlog, auth }
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

    const { user, auth } = await getUserAndAuthenticate(blog, request.token)
    if (auth){
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