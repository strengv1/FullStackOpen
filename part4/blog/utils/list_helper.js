var lodash = require('lodash')

const dummy = () => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0 ? 0
    : blogs.reduce(
      (sum, blog) => {
        return sum += blog.likes
      }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce( (prev, current) => prev.likes > current.likes ? prev : current, {} )
}

const mostBlogs = (blogs) => {
  // reduce the array "blogs" to an object containing all authors,
  // containing all their blogs
  const authorObj = lodash.groupBy(blogs, 'author')

  // Find author with mosts blogs
  const authorWithMostBlogs = lodash
    .maxBy(Object.keys(authorObj), (o) => authorObj[o].length)

  return authorWithMostBlogs ? {
    author: authorWithMostBlogs,
    blogs: authorObj[authorWithMostBlogs].length
  } : {}
}

const mostLikes = (blogs) => {
  // Reduce the array "blogs" to object containing all authors

  const authorObj = blogs.reduce((authors, current) => {
    authors[current.author] = authors[current.author] + current.likes || current.likes
    return authors
  }, {})

  // Find author with most likes
  const authorWithMostLikes = lodash.
    maxBy(Object.keys(authorObj), (o) => authorObj[o])

  return {
    author: authorWithMostLikes,
    likes: authorObj[authorWithMostLikes]
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}