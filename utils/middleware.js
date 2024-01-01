import logger from './logger.js'

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path: ', req.path)
  logger.info('Body: ', req.body)
  logger.info('----')
  next()
}


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknow endpoint' })
}


//manejar un error cuando el formato proporcionado en el parámetro del id es incorrecto o cuando no pasa las validaciones de mongoose
const errorHandler = (err, req, res, next) => {
  logger.error(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }
  next(err)
}


export default {
  requestLogger,
  unknownEndpoint,
  errorHandler
}