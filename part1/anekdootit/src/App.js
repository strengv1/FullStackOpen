import { useState } from 'react'

// Source: 
// https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
function argMax(arr) {
  if (arr.length === 0) {
      return -1;
  }
  var max = arr[0];
  var maxIndex = 0;
  for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }

  return maxIndex;
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))

  const randomAnecdote = () => (
    setSelected( Math.floor(Math.random() * anecdotes.length) )
  )
  const voteThisAnecdote = () => {
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)
  }

  return (
    <>
      <div>
        <h1>Anecdote of the day</h1>
        {anecdotes[selected]}
        <br/>
        has {points[selected]} points
        <br/>
        <button onClick={voteThisAnecdote}>vote</button>
        <button onClick={randomAnecdote}>next anecdote</button>
      </div>

      <div>
        <h1>Anecdote with most votes</h1>
        {anecdotes[argMax(points)]}
      </div>
    </>
  )
}

export default App