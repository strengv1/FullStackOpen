const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('bearer ')) {
    req.token = authorization.replace('bearer ', '')
  }
  next()
}

async function userExtractor(req, res, next) {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  req.user = await User.findById(decodedToken.id)

  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({
      error: 'invlid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  errorHandler
}