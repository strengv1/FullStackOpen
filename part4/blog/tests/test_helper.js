const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Esimerkkiblogi',
    author: 'Kalle Kirjailija',
    url: 'url.com',
    likes: 1,
  },
  {
    title: 'Miksi testaaminen on helppoa ja kivaa',
    author: 'Teemu Testeri',
    url: 'testisivu.com',
    likes: 13
  },
  {
    title: 'Miksi node on helppoa ja kivaa',
    author: 'Kalle Koodari',
    url: 'hieno-osoite.com',
    likes: 4
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'tämä poistuu pian' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}