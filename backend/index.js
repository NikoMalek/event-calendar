import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, SECRET_JWT_KEY, FRONTEND_URL } from './config.js'
import { UserDB } from './user-db.js'
import cors from 'cors';
import sequelize from './db.js';
import './models/User.js';



const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));  

// middleware para verificar si el usuario está autenticado
app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.user = null
  try{
    const data = jwt.verify(token, SECRET_JWT_KEY)
    req.user = data
  } catch {}

  next()
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/login', async (req, res) => {
  const { username, password } = req.body
  
  try {
    const user = await UserDB.login({ username, password })
    const token = jwt.sign({ id: user.ID_USER, username: user.username },SECRET_JWT_KEY, { 
      expiresIn: '1h' 
    })
    res
      .cookie('access_token', token, {
        httpOnly: true, // la cookie no puede ser leída por el frontend
        secure: process.env.NODE_ENV ==='production', // solo se envía en conexiones https cuando es true
        // sameSite: 'none', // la cookie se envía en todas las peticiones
        maxAge: 1000 * 60 * 60 // tiempo de vida de la cookie en milisegundos
      })
      .send({ user, token })
  } catch (error) {
    res.status(401).send(error.message)
  }
})



app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try{
    const id = await UserDB.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})
app.get('/logout', (req, res) => {
  res.clearCookie('access_token').send('Logout success')
})





app.get('/protected', (req, res) => {
  const user = req.user
  if (!user) {
    return res.status(401).send('No autorizado')
  }
  console.log(user)
  res.json({
    id: user.id,
    username: user.username
  });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

sequelize.sync().then(() => {
  console.log('Database & tables created!');
});
