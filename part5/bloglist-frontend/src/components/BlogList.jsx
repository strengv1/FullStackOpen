import { useState } from 'react'
import blogService from './../services/blogs'
import Blog from './Blog'
import PropTypes from 'prop-types'

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

BlogList.propTypes = {
  user: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  blogsToShow: PropTypes.array.isRequired,
  functions: PropTypes.array.isRequired
}

export default BlogList