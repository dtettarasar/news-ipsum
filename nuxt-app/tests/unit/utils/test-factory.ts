import bcrypt from 'bcryptjs'

export const generateTestUserData = (role: 'admin' | 'editor' | 'user' = 'user') => {
  const id = Math.floor(Math.random() * 10000)
  return {
    name: `TestUser_${id}`,
    email: `test_${role}_${id}@news-ipsum.com`,
    password: 'Password123!',
    role: role,
    username: `user_${id}`
  }
}