import { sql } from '@vercel/postgres';
import { User } from './definition';
import bcrypt from 'bcrypt';

export async function fecthUsers() {
  try {   

    const data = await sql<User>`SELECT * FROM users`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function fecthUsersById(_id:string) {
  try {

    const data = await sql<User>`SELECT * FROM users  where id =${_id}`;

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function authenticateUser(_id: string, _password : string) {
  try {

    const hashedPassword = await bcrypt.hash(_password, 10);
    const token = await bcrypt.hash(_password
      + _id, 10);

    const data = await sql<User>`SELECT * FROM users  where id = ${_id} and password = ${_password} and token= = ${token}`;
    return Boolean(data.rowCount);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch authenticated user.');
  }
}

