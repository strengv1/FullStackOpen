import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good+neutral+bad

  const Header = ({text}) => (
    <div class="header">
      <h1>{text}</h1>
    </div>
  )
  // const Part = ({text, value}) => <div>{text} {value}</div>
  const Button = ({ handleClick, text }) => ( <button onClick={handleClick}> {text} </button> )
  
  return (
    <>
      <Header text="Give feedback"/>
      <div class="buttons">
        <Button handleClick={() => setGood(good+1)} text="good"/>
        <Button handleClick={() => setNeutral(neutral+1)} text="neutral"/>
        <Button handleClick={() => setBad(bad+1)} text="bad"/>
      </div>
      
      <div class="stats">
        <Header text="Statistics"/>
        <div>good {good}</div>
        <div>neutral {neutral}</div>
        <div>bad {bad}</div>
        <div>all {all}</div>
        <div>average {(good-bad)/(all)}</div>
        <div>positive {good/all}</div>
      </div>  
    </>
  )
}

export default App