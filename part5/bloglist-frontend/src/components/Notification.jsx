import PropTypes from 'prop-types'

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }
  const colorStyle = { color: isError ? 'red' : 'green' }
  return (
    <div className="error"
      style={colorStyle}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  isError: PropTypes.bool.isRequired
}

export default Notification