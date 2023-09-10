const Blog = ({ blog }) => {
   

  return (
    <div className="blog">
      <span>{blog.title}</span>
      <span><button onClick={() => console.log('hide')}>view</button></span>
      
      <div className="blog-extra-info" >
      
        <div>
          {blog.url}
        </div>
        <div>
          likes: {blog.likes}
          <button onClick={() => console.log('like ', blog.title)}>like</button>
        </div>
        <div>
          {blog.author}
        </div>
      </div>
    </div>
  )

  
}
  

export default Blog