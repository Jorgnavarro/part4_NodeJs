import config from './utils/config.js'
import logger from './utils/logger.js'
import express from 'express'
const app = express()
import cors from 'cors'
import mongoose from 'mongoose'
import morgan from 'morgan'
import blogsRouter from './controllers/blogs.js'
import middleware from './utils/middleware.js'
logger.info('conneting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(result => {
    logger.info('Conected to MongoDB')
  })
  .catch(err => {
    logger.error('Error connecting to MongoDB: ', err.message)
  })

app.disable('x-powered-by')
app.use(cors())
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app