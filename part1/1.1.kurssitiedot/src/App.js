const Header = (props) => {
  return  <div class="header">
            <h1>{props.coursename}</h1>
          </div>
}

const Part = (props) => {
  return(
    <>
      <p>{props.name + " " + props.exercises} </p>
    </>
  )
}
const Content = (props) => {
  const [first, second, third] = props.parts
  return(
    <div class="content">
      <Part name={first.name} exercises={first.exercises}/>
      <Part name={second.name} exercises={second.exercises}/>
      <Part name={third.name} exercises={third.exercises}/>
    </div>
  )
}
const Total = (props) => {
  const [first, second, third] = props.parts
  return(
    <div class="total">
      <p>Number of exercises {first.exercises + second.exercises + third.exercises}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <>
      <Header coursename={course.name} />      
      <Content parts={course.parts} />
      <Total  parts={course.parts}/>
    </>
  )
}

export default App
