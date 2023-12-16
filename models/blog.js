import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        minlength: 5,
        required: true
    },
    author: {
        type: String,
        minlength: 3,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    likes: Number,
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog