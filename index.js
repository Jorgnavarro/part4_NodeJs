import { config } from 'dotenv'
config()
import http from 'node:http'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'


const app = express()

const url = process.env.MONGODB_URI

console.log('conecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('Conected to MongoDB')
  })
  .catch(err => {
    console.log('Error connecting to MongoDB: ', err.message)
  })

app.disable('x-powered-by')

app.use(cors())
app.use(express.json())

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

app.get('/api/blogs', (req, res) => {
    Blog
        .find({})
        .then(blogs => {
            res.json(blogs)
        })
})

app.post('/api/blogs', (req, res) => {
    const blog = new Blog(req.body)
    console.log(blog)
    blog
        .save()
        .then(result => {
            res.status(201).json(result)
        })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})