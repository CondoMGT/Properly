import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import { users,roles } from '../lib/placeholder-data';


const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const token = await bcrypt.hash(user.password 
        + user.id, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password, token)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword},${token})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );

  return insertedUsers;
}


async function seedRoles() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS roles (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      role_name VARCHAR(255) NOT NULL      
    );
  `;

  const insertedRoles = await Promise.all(
    roles.map(async (roles) => {

      return client.sql`
        INSERT INTO roles (id, role_name)
        VALUES (${roles.id}, ${roles.role_name})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );
  );

  return insertedRoles;
}

async function seedResources() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS resources (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      ros_name VARCHAR(255) NOT NULL , display_name     
    );
  `;

  const insertedResources = await Promise.all(
    roles.map(async (roles) => {

      return client.sql`
        INSERT INTO resources (id, res_name, display_name)
        VALUES (${roles.id}, ${roles.role_name})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );
  );

  return insertedResources;
}

export async function GET() {

  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedRoles();
    await seedResources();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}
