import { useState } from 'react'

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good+neutral+bad

  const Header = ({text}) => (
    <div>
      <h1>{text}</h1>
    </div>
  )
  // const Part = ({text, value}) => <div>{text} {value}</div>
  const Button = ({ handleClick, text }) => ( <button onClick={handleClick}> {text} </button> )
  
  const Statistics = (props) => {
    const [good, neutral, bad, all, avg, pos] = props.values
    if (all < 1){
      return (
        <div>
          <Header text="Statistics"/>
          No feedback given
        </div>
      )
    }
    return (
      <div>
        <Header text="Statistics"/>
        <div>good {good}</div>
        <div>neutral {neutral}</div>
        <div>bad {bad}</div>
        <div>all {all}</div>
        <div>average {avg}</div>
        <div>positive {pos}</div>
      </div>
      )
      
  }
  
  return (
    <>
      <Header text="Give feedback"/>
      <div>
        <Button handleClick={() => setGood(good+1)} text="good"/>
        <Button handleClick={() => setNeutral(neutral+1)} text="neutral"/>
        <Button handleClick={() => setBad(bad+1)} text="bad"/>
      </div>
      
      <Statistics values={[good, 
                          neutral, 
                          bad, 
                          all, 
                          (good-bad)/(all), 
                          good/all]}/>
    </>
  )
}

export default App