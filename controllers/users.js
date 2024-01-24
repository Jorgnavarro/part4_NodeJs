import bcrypt from 'bcrypt'
import { Router } from 'express'
import User from '../models/user.js'


const usersRouter = Router()

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })

  res.json(users)
})

usersRouter.get('/:username', async (req, res) => {

  const user = await User.find({ username: req.params.username })

  if(user.length>0){
    res.json(user)
  }else{
    res.status(404).end()
  }
})

usersRouter.post('/', async (req, res) => {
  const body = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })


  if(body.password.length>=3 && body.password){
    const savedUser = await user.save()
    res.json(savedUser)
  }else{
    res.status(400).json({
      error: 'Password is required and should be at least 3 characters'
    })
  }

})

export default usersRouter