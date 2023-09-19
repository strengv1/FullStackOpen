import {useState} from 'react'

import Blog from './Blog'

const BlogList = ({ blogs, blogsToShow, setBlogsToShow }) => {
    // If refreshed, blogsToShow is empty at beginning! ?
    // Looks weird but works? A bit shady tho
  console.log(blogsToShow)
  // When clicked, toggle the state of the boolean in that index
  const handleViewClick = (index) => {
    const newBlogsToShow = [...blogsToShow]
    newBlogsToShow[index] = !newBlogsToShow[index]
    setBlogsToShow(newBlogsToShow)
  }

  return (
    <div className="blogs">
      {blogs.map((blog, index) =>
          <Blog key={ 
            blog.id} 
            blog={blog} 
            index={index} 
            handleViewClick={handleViewClick} 
            showInfo={blogsToShow[index]
          }/>
      )} 
    </div>
  )
}

export default BlogList