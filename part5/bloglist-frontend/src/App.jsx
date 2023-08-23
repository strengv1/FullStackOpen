import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState('')
  const [newTitle, setNewTitle] = useState('') 
  const [newAuthor, setNewAuthor] = useState('') 
  const [newUrl, setNewUrl] = useState('')

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
    } catch (exception) {
      console.log(exception)
      
      setTimeout(() => {
        // Tyhjennä error
      }, 5000)
    }
  }
  const addNewBlog = (event) => { 
    event.preventDefault() 
    try {
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      }
      blogService
        .create(blogObject, user)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNewTitle('')
          setNewAuthor('')
          setNewUrl('')
          // showNotification(`Added ${returnedPerson.name}`, false)
      })
      .catch(error => {
        //showNotification(error.response.data.error, true)
        console.log(`Error: ${error}`)
      })
    } catch (exception) {
      console.log(exception)
    }
  }

  const newBlogForm = () => (
    <form onSubmit={addNewBlog}>
      <h2>Create new</h2>
      <div>
        title:
          <input
          type="text"
          value={newTitle}
          name="title"
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
        author:
          <input
          type="text"
          value={newAuthor}
          name="author"
          onChange={({ target }) => setNewAuthor(target.value)}
        />
      </div>
      <div>
        url:
          <input
          type="text"
          value={newUrl}
          name="url"
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>  
  )
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
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

  // If not logged in, only render the login form
  if (!user) { 
    return loginForm() 
  }
  // else render the blogs
  return (
    <div>
      <h2>blogs</h2>
      <p>
        logged in as {user.name}
        <button onClick={() => logout()}>Logout</button>
      </p>

      {newBlogForm()}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      
    </div>
  )
}

export default App