import { useDispatch } from 'react-redux'
import { addNew } from './../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addNewAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    dispatch( addNew(content) )
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={ addNewAnecdote }>
        <div>
          <input name="anecdote"/>
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm