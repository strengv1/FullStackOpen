const Blog = ({ blog, index, handleViewClick, showInfo }) => {

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
          <button onClick={() => console.log('like ', blog.title)}>like</button>
        </div>
        <div>
          { blog.user.name }
        </div>
      </div>
    </div>
  )
}

export default Blog