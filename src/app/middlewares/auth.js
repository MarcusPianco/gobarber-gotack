import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Tojken not provider' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // expoe o id do user internamente após a authetication com o token
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Tojken invalid' });
  }
};