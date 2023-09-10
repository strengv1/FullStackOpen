const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }
  const colorStyle = {color: isError ? 'red' : 'green'}
  return (
    <div className="error"
        style={colorStyle}>
      {message}
    </div>
  )
}

export default Notification