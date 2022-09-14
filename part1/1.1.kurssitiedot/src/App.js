const Header = (props) => {
  return(
    <div id="header">
      <h1>{props.course}</h1>
    </div>
  )
}
const Content = (props) => {
  return(
    <div id="content">
      <p>
        {props.courses[0]} {props.exercises[0]}
      </p>
      <p>
        {props.courses[1]} {props.exercises[1]}
      </p>  
      <p>
        {props.courses[2]} {props.exercises[2]}
      </p>
    </div>
  )
}
const Total = (props) => {
  return(
    <div id="total">
      <p>Number of exercises {props.total}</p>
    </div>
    
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'  
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  return (
    <>
      <Header course={course} />
      <Content courses={[part1,part2,part3]} exercises={[exercises1,exercises2,exercises3]} />
      <Total  total={exercises1+exercises2+exercises3}/>
    </>
  )
}

export default App
