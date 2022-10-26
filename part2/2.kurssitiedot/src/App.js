


const Course = ({ course }) => {
  const Header = ({ coursename }) => {
    return  <div>
              <h1>{coursename}</h1>
            </div>
  }
  const Content = ({parts}) => {
    const Part = (props) => {
      return(
        <>
          <p>{props.name + " " + props.exercises} </p>
        </>
      )
    }
    return(
      <div>
        {parts.map( 
            part =>
            <Part key={part.id} name={part.name} exercises={part.exercises}/>
        )}
      </div>
    )
  }
  const Total = ({parts}) =>
  {
    let sum = 0;
    parts.forEach(element => {
      sum += element.exercises;
    });
    
    return(
      <div>
        <b>total of {sum} exercises</b>
      </div>
    )
  }
  return (
    <div>
      <Header coursename={course.name} />      
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App
