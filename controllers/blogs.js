import { Router } from "express";
import Blog from "../models/blog.js"

const blogsRouter = Router()

blogsRouter.get('/', (req, res) => {
    Blog
        .find({})
        .then(blogs => {
            res.json(blogs)
        })
})

blogsRouter.post('/', (req, res) => {
    const blog = new Blog(req.body)
    blog
        .save()
        .then(result => {
            res.status(201).json(result)
        })
})

export default blogsRouter 