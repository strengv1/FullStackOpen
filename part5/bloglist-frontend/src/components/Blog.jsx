const Blog = ({ blog, index, handleViewClick, showInfo }) => {

  return (
    <div className="blog">
      <span>{ blog.title } { blog.author }</span>
      <span><button onClick={() => handleViewClick(index)}>view</button></span>
      <div className="blog-extra-info"
           style={{display: showInfo ? 'block' : 'none'}} >
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