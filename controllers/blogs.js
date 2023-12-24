import { Router } from "express";
import Blog from "../models/blog.js"

const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body)
    blog
        .save()
        .then(result => {
            res.status(201).json(result)
        })
})

export default blogsRouter 