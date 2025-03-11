import { QueryResult } from 'mysql2';
import { queryDB } from './db';
import { AuthInfo, User } from '../types/users';
import { getCache, setCache } from 'src/utils/redis';


export const getAuthInfo = async (email: string): Promise<AuthInfo | null> => {
  const authInfo = await queryDB<AuthInfo>('SELECT id, password_hash FROM users WHERE email = ?', [email]);

  return authInfo.length > 0 ? authInfo[0] : null;
};

export const createUser = async (user: User): Promise<QueryResult> => {
  const [result] = await queryDB<QueryResult>('INSERT INTO users (id, email, password_hash, role, name, surname, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      user.id,
      user.email,
      user.password_hash,
      user.role,
      user.name,
      user.surname,
      user.phone
    ]
  );

  return result;
};

export const getUser = async (id: string): Promise<User | null> => {
  const cache = await getCache<User>(`user:${id}`);
  if (cache) {
    return cache;
  }

  const users = await queryDB<User>('SELECT id, email, role, name, surname, phone, createdAt FROM users WHERE id = ?', [id]);

  const user = users.length > 0 ? users[0] : null;
  if (user) {
    await setCache(`user:${id}`, user);
  }

  return user;
};
