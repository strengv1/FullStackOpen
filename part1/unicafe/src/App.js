import { useState } from 'react'

const Header = ({text}) => ( <div> <h1>{text}</h1> </div> )
const Button = ({ handleClick, text }) => ( <button onClick={handleClick}> {text} </button> )
const StatisticLine = ({text, value}) => ( 
  <tr>
    <td>{text}</td> 
    <td>{value}</td>
  </tr> 
)
const Statistics = (props) => {
  const [good, neutral, bad, all, avg, pos] = props.values
  if (all < 1){
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>
        <StatisticLine text="all" value={all}/>
        <StatisticLine text="average" value={avg}/>
        <StatisticLine text="positive" value={pos}/>
      </tbody>
    </table>
    )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const all = good+neutral+bad
  const avg = ((good-bad)/all).toFixed(2) 
  const pos = ((good/all) * 100).toFixed(1) + ' %'

  return (
    <>
      <Header text="give feedback"/>
      <div>
        <Button handleClick={() => setGood(good+1)} text="good"/>
        <Button handleClick={() => setNeutral(neutral+1)} text="neutral"/>
        <Button handleClick={() => setBad(bad+1)} text="bad"/>
      </div>
      <Header text="statistics"/>
      <Statistics values={[good, 
                          neutral, 
                          bad, 
                          all, 
                          avg, 
                          pos]}/>
    </>
  )
}

export default App