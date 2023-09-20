const Blog = ({ blog, index, showInfo, handleViewClick, handleLikeClick, removeBlog }) => {

  return (
    <div className="blog">
      <div className="blog-title" onClick={() => handleViewClick(index)}>
        { blog.title } { blog.author } 
        <button onClick={() => handleViewClick(index)}>view</button>
      </div>
      <div className="blog-extra-info"
           style={{ display: showInfo ? 'block' : 'none' }} >
        <div>
          { blog.url }
        </div>
        <div>
          likes: { blog.likes }
          <button onClick={() => handleLikeClick(blog)}>like</button>
        </div>
        <div>
          { blog.user.name }
        </div>
        <button onClick={() => removeBlog(blog)}>Remove</button>
      </div>
    </div>
  )
}

export default Blog