import { Router } from 'express'
import Blog from '../models/blog.js'
import User from '../models/user.js'

const blogsRouter = Router()

blogsRouter.get('/', async ( req, res ) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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

  const user = await User.findById(body.userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
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