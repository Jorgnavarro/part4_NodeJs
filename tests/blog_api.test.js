import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'


const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))

  const promiseArrayBlogs = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArrayBlogs)
})

describe('When there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(blog => blog.title)

    expect(contents).toContain('Canonical string reduction')
  })

  test('The ID property must exist', async () => {
    const formatBlogs = await helper.blogsInDb()

    formatBlogs.map(blog => {
      expect(blog.id).toBeDefined()
    })
  })

})

describe('Viewing a specific blog', () => {

  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[1]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body).toEqual(blogToView)
  })


})

describe('Addition of a new blog', () => {

  test('succeeds with valid data', async () => {
    const user = await User.findOne( { username: 'root' } )

    const newBlog = {
      title: 'Adding a new blog from testing',
      author: 'Luis Navarro',
      url: 'http://jorgluisnavarro.com',
      likes: 10
    }
    const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET, { expiresIn: 60*60 })

    await api
      .post('/api/blogs')
      .set( { Authorization:`bearer ${token}` } )
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsUpdate = await helper.blogsInDb()

    expect(blogsUpdate).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsUpdate.map(blog => blog.title)

    expect(titles).toContain('Adding a new blog from testing')
  })

  test('If the likes property is not there it should be zero', async () => {
    const user = await User.findOne( { username: 'root' } )

    const newBlog = {
      title: 'Adding a new blog without likes property',
      author: 'Luis Navarro',
      url: 'http://jorgluisnavarro.com',
    }

    const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET, { expiresIn: 60*60 })

    const blogCreated = await api
      .post('/api/blogs')
      .set( { Authorization:`bearer ${token}` } )
      .send(newBlog)

    expect(blogCreated.body.likes).toBe(0)
  })

  test('fails with status 400 if data invalid', async () => {
    const newBlog = {
      author: 'Luis Navarro',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsUpdate = await helper.blogsInDb()

    expect(blogsUpdate).toHaveLength(helper.initialBlogs.length)
  })
})

describe('Modifying a blog', () => {

  test('update the property likes a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToUpdate = blogsAtStart[2]

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 20
    }

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    expect(result.body.likes).toBe(20)
  })

})

describe('Deletion of a blog', () => {

  test('Succeeds with status code 204 if id valid', async () => {

    const user = await User.findOne( { username: 'root' } )

    const newBlog = {
      title: 'Adding a new blog from delete',
      author: 'Luis Navarro',
      url: 'http://jorgluisnavarro.com',
      likes: 40
    }
    const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET, { expiresIn: 60*60 })

    const result = await api
      .post('/api/blogs')
      .set( { Authorization:`bearer ${token}` } )
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    await api
      .delete(`/api/blogs/${result.body.id}`)
      .set( { Authorization:`bearer ${token}` } )
      .expect(204)

  })
})

afterAll(() => {
  mongoose.connection.close()
})