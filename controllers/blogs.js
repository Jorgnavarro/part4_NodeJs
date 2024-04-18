import { Router } from 'express'
import middleware from '../utils/middleware.js'
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


blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body

  const user = await User.findById(req.user.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    comments: body.comments === undefined ? [] : body.comments,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.json(savedBlog)

})

blogsRouter.post('/:id/comments', async (req, res) => {
  const content = req.body
  console.log(content)
  const blog = await Blog.findById(req.params.id)

  console.log(blog)

  if(!blog){
    return res.status(404).json({ error: 'Blog not found' })
  }

  blog.comments.push(content)

  const blogWithComment  = await blog.save()

  res.json(blogWithComment)


})



blogsRouter.put('/:id', middleware.userExtractor, async (req, res) => {

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

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {

  const blog = await Blog.findById(req.params.id)

  const userId = req.user.id

  if( blog.user.toString() === userId ){
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  }else{
    return res.status(401).json({ error: 'The token is missing or invalid to perform this operation.' })
  }

})

export default blogsRouter