import config from './utils/config.js'
import logger from './utils/logger.js'
import express from 'express'
const app = express()
import cors from 'cors'
import mongoose from 'mongoose'
import blogsRouter from './controllers/blogs.js'

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
app.use(express.json())
app.use('/api/blogs', blogsRouter)

export default app