import { Router } from 'express'
import Blog from '../models/blog.js'

const blogsRouter = Router()

blogsRouter.get('/', async ( req, res ) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {

  const blog = await Blog.findById(req.params.id)

  if(blog){
    res.json(blog)
  }else{
    res.status(404).send('<h1>The resource does not exist in our database</h1>').end()
  }

})

blogsRouter.post('/', async (req, res) => {
  const body = req.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  res.json(savedBlog)

})

blogsRouter.put('/:id', async (req, res) => {

  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })

  res.json(updatedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {

  await Blog.findByIdAndDelete(req.params.id)

  res.status(204).end()
})

export default blogsRouter