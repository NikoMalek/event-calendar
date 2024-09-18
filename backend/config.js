import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = 5000, // Default port
  SECRET_JWT_KEY = 'default-secret-key', // Default secret key
  FRONTEND_URL = 'http://localhost:8000', // Default frontend url
} = process.env
