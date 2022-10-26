


const Course = ({ course }) => {
  const Header = ({ coursename }) => {
    return  <h2> {coursename} </h2>
  }
  const Content = ({ parts }) => {
    const Part = (props) => {
      return (
        <>
          <p>{props.name + " " + props.exercises} </p>
        </>
      )
    }
    return (
      <div>
        {parts.map(
          part =>
            <Part key={part.id} name={part.name} exercises={part.exercises} />
        )}
      </div>
    )
  }
  const Total = ({ parts }) => {
    const sum = parts.reduce(
      (s, p) => s + p.exercises, 0
    );

    return (
      <div>
        <b>total of {sum} exercises</b>
      </div>
    )
  }
  return (
    <div>
      <Header coursename={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}
const App = () => {
  const courses = [
    {
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
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }, 
    {
      name: 'Oma kurssi',
      id: 3,
      parts: [
        {
          name: 'Eka osa',
          exercises: 5,
          id: 1
        },
        {
          name: 'Toka osa',
          exercises: 7,
          id: 2
        },
        {
          name: 'Kolmas osa',
          exercises: 6,
          id: 3
        }
      ]
    }
  ]

  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(
        course => <Course key={course.id} course={course}/>
      )}
    </div>
  )
}

export default App
