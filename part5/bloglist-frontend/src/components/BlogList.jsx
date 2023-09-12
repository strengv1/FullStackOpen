import {useState} from 'react'

import Blog from './Blog'

const BlogList = ({ blogs }) => {
  const [blogsToShow, setBlogsToShow] = useState(
    new Array(blogs.length).fill(false)
  )
    // If refreshed, blogsToShow is empty at beginning! ?



  // When clicked, toggle the state of the boolean in that index
  const handleViewClick = (index) => {
    const newBlogsToShow = [...blogsToShow]
    newBlogsToShow[index] = !newBlogsToShow[index]
    setBlogsToShow(newBlogsToShow)
  }
  console.log('blogsToShow:', blogsToShow)
  return (
    <div className="blogs">
      {blogs.map((blog, index) =>
          <Blog key={ blog.id} 
                      blog={blog} 
                      index={index} 
                      handleViewClick={handleViewClick} 
                      showInfo={blogsToShow[index]}
          />
      )} 
    </div>
  )
}

export default BlogList