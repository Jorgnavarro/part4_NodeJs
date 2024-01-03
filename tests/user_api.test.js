import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
const api = supertest(app)
import helper from './test_helper.js'
import bcrypt from 'bcrypt'
import User from '../models/user.js'


beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('khease', 10)

  const user = new User({
    username: 'root',
    passwordHash
  })

  await user.save()
})


describe('When there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Programmer',
      name: 'Luis Navarro',
      password: 'fullstack10'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)

    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'mychoice',
      password: 'khease',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})