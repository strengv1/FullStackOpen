import {useState} from 'react'
import blogService from './../services/blogs'
import Blog from './Blog'

const BlogList = ({ user, blogs, blogsToShow, functions }) => {
  
  return (
    <div className="blogs">
      {blogs.map((blog, index) =>
          <Blog key={blog.id}
            user={user}
            blog={blog}
            index={index}
            showInfo={blogsToShow[index]}
            functions={functions}
          />
      )} 
    </div>
  )
}

export default BlogList