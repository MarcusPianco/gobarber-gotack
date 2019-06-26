import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Marcus',
    email: 'marcusjrdev@gmail.com',
    password_hash: '12345',
  });

  return res.json(user);
});

export default routes;