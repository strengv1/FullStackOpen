import {useState} from 'react'
import blogService from './../services/blogs'
import Blog from './Blog'

const BlogList = ({ blogs, blogsToShow, handleViewClick, handleLikeClick, removeBlog }) => {
  
  return (
    <div className="blogs">
      {blogs.map((blog, index) =>
          <Blog key={blog.id}
            blog={blog}
            index={index}
            showInfo={blogsToShow[index]}
            handleViewClick={handleViewClick} 
            handleLikeClick={handleLikeClick}
            removeBlog={removeBlog}
          />
      )} 
    </div>
  )
}

export default BlogList