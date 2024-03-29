import { useState, useEffect, useRef } from 'react'
import './index.css'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogsToShow, setBlogsToShow] = useState(
    new Array(blogs.length).fill(false),
  )
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationIsError, setNotificationIsError] = useState(true)
  const [fetchData, setFetchData] = useState(true) // weird solution for 5.8* but seems to work?

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [fetchData])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const showNotification = (message, isError) => {
    setNotificationMessage(message)
    setNotificationIsError(isError)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage(null)
    } catch (exception) {
      showNotification('Username or password incorrect', true)
    }
  }
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      blogService
        .create(blogObject, user)
        .then((returnedBlog) => {
          setBlogs(blogs.concat(returnedBlog))
          setFetchData(!fetchData)
        })
        .catch((error) => {
          showNotification(
            error.response
              ? error.response.data.error
              : 'Unidentified error occured, error:',
            error,
            true,
          )
        })
    } catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <Notification
        message={notificationMessage}
        isError={notificationIsError}
      />
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  // When clicked, toggle the state of the boolean in that index
  const handleViewClick = (index) => {
    const newBlogsToShow = [...blogsToShow]
    newBlogsToShow[index] = !newBlogsToShow[index]
    setBlogsToShow(newBlogsToShow)
  }

  const handleLikeClick = (likedBlog) => {
    const backupUser = likedBlog.user
    const newBlog = {
      ...likedBlog,
      likes: likedBlog.likes + 1,
      user: likedBlog.user.id,
    }

    blogService
      .update(likedBlog.id, newBlog)
      .then((returnedBlog) => {
        setBlogs(
          blogs.map((b) =>
            b.id !== likedBlog.id ? b : { ...returnedBlog, user: backupUser },
          ),
        )
      })
      .catch((error) => console.log('error: ', error.data.message))
  }

  const removeBlog = (blog, idx) => {
    const removeIdxFromBlogsToShow = (idx) => {
      var newArray = [...blogsToShow] // make a separate copy of the array
      if (idx !== -1) {
        newArray.splice(idx, 1)
        setBlogsToShow(newArray)
      }
    }
    const removeThis = blogs.find((b) => b.id === blog.id)

    if (
      window.confirm(`Remove blog ${removeThis.title} by ${removeThis.author}?`)
    ) {
      blogService
        .remove(removeThis.id, user)
        .catch((error) => console.log('error removing blog:', error))

      // How to NOT do this when an error occurs ? :3
      setBlogs(blogs.filter((b) => b.id !== removeThis.id))
      removeIdxFromBlogsToShow(idx)
      showNotification(
        `Blog ${blog.title} by ${removeThis.author} was removed succesfully`,
        false,
      )
    }
  }
  const logout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    window.location.reload(false)
  }

  const blogFormRef = useRef()

  // If not logged in, only render the login form
  if (!user) {
    return loginForm()
  }
  // else render the blogs
  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={notificationMessage}
        isError={notificationIsError}
      />

      <p>
        logged in as {user.name}
        <button onClick={() => logout()}>Logout</button>
      </p>
      <Togglable buttonLabel='add new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} showNotification={showNotification} />
      </Togglable>

      <BlogList
        user={user}
        blogs={blogs}
        blogsToShow={blogsToShow}
        functions={[handleViewClick, handleLikeClick, removeBlog]}
      />
    </div>
  )
}

export default App
