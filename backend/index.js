import express from 'express'
import { PORT } from './config.js'
import { UserDB } from './user-db.js'
import cors from 'cors';



const app = express()
app.use(express.json())
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/login', async (req, res) => {
  const { username, password } = req.body
  console.log(req.body)
  try {
    const user = await UserDB.login({ username, password })
    res.send(user)
  } catch (error) {
    res.status(401).send(error.message)
  }
})



app.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log(req.body)

  try{
    const id = await UserDB.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})
app.get('/profile', (req, res) => {})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
