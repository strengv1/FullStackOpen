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
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationIsError, setNotificationIsError] = useState(true)
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      ) 
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
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
      })
      .catch(error => {
        showNotification(error.response ? error.response.data.error : 'Unidentified error occured, error:', error, true)
      })
    } catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <Notification message={notificationMessage}
                    isError={notificationIsError}/>
      <div>
        username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type="submit">login</button>
    </form>      
  )

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
      <Notification message={notificationMessage}
                    isError={notificationIsError}/>

      <p>
        logged in as {user.name}
        <button onClick={() => logout()}>Logout</button>
      </p>
      <Togglable buttonLabel="add new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} showNotification={showNotification} />
      </Togglable>
      
      <BlogList blogs={blogs}/>
      
    </div>
  )
}

export default App