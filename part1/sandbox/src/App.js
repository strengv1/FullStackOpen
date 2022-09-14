const App = () => {

  const now = new Date()
  const a = 10
  const b = 20

  return (
    <div>
      <p>Hello World, it is {now.toString()}</p>
      <p>
        {a} + {b} = {a+b}
      </p>
    </div>
  )
}

export default App;
