const Header = ({ coursename }) => {
  return  <h2> {coursename} </h2>
}
const Part = (props) => {
  return (
    <>
      <p>{props.name + " " + props.exercises} </p>
    </>
  )
}
const Content = ({ parts }) => {
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
const Course = ({ course }) => {
    
  return (
    <div>
      <Header coursename={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course