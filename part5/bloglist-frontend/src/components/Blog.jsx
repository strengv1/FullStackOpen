import PropTypes from 'prop-types'

const Blog = ({ user, blog, index, showInfo, functions }) => {
  const handleViewClick = functions[0]
  const handleLikeClick = functions[1]
  const removeBlog = functions[2]

  const extraInfo = (
    <div className="blog-extra-info">
      <div>{blog.url}</div>
      <div>
        likes: {blog.likes}
        <button onClick={() => handleLikeClick(blog)}>like</button>
      </div>
      <div>{blog.user.name}</div>

      {blog.user.username === user.username && (
        <button onClick={() => removeBlog(blog, index)}>Remove</button>
      )}
    </div>
  )

  return (
    <div className="blog">
      <div className="blog-title" onClick={() => handleViewClick(index)}>
        {blog.title} {blog.author}
        <button onClick={() => handleViewClick(index)}>view</button>
      </div>

      {showInfo && extraInfo}
    </div>
  )
}

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  showInfo: PropTypes.bool,
  functions: PropTypes.array.isRequired,
}

export default Blog
