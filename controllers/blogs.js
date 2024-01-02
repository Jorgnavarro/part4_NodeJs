import { Router } from 'express'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'

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

// const getTokenFrom = req => {
//   const authorization = req.get('authorization')
//   if(authorization && authorization.toLowerCase().startsWith('bearer ')){
//     return authorization.substring(7)
//   }
//   return null
// }



blogsRouter.post('/', async (req, res) => {
  const body = req.body

  //const token = getTokenFrom(req)

  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if(!req.token || !decodedToken){
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

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

  const blog = await Blog.findById(req.params.id)

  const userId = await User.findById(blog.user)

  if( blog.user.toString() === userId._id.toString() ){
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  }else{
    return res.status(401).json({ error: 'The token is missing or invalid to perform this operation.' })
  }

})

export default blogsRouter