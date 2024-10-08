import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import User from './models/User.js';
// import DBLocal from 'db-local';


// const { Schema } = new DBLocal({ path: './userdb' });

// Aqui se define el esquema de usuario
const userSchema = z.object({
  username: z.string().min(1, 'username must be a non-empty string'),
  password: z.string().min(3, 'La contraseña debe tener al menos 3 caracteres')
});


// const User = Schema('User', {
//   _id: {type: String,required: true},
//   username: {type: String,required: true},
//   password: {type: String,required: true}
// })

export class UserDB {
  static async create ({ username , password }) {

    try {
      userSchema.parse({ username, password });
    } catch (error) {
      throw new Error(error.errors[0].message);
    }


    // verificar si el usuario no existe

    const user = await User.findOne({ where: { username } });
    if (user) {
      throw new Error('El correo electronico ya esta registrado')
    }

    // crear id
    const id = crypto.randomUUID()

    const hashedPassword = await bcrypt.hash(password, 10) // 10 es el número de veces que se va a encriptar la contraseña

    await User.create({
      ID_USER: id,
      username, 
      password: hashedPassword
    });
    
    return id

  }
  static async login ({ username , password }) {

    try {
      userSchema.parse({ username, password });
    } catch (error) {
      throw new Error(error.errors[0].message);
    }

    const user = await User.findOne({ where: { username } });
    if (!user) { throw new Error('El correo electronico no existe') }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) { throw new Error('Contraseña Incorrecta') }

    const { password: _, ...publicUser } = user.toJSON();
    // const { _id,password: _, ...publicUser } = user

    return publicUser

  }



}