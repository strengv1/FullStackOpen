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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}