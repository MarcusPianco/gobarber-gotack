import 'dotenv/config';
import * as Sentry from '@sentry/node';
import express from 'express';
import path from 'path';
import Youch from 'youch';
import 'express-async-errors';
import routes from './routes';
import './database';
import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const erros = await new Youch(err, req).toJSON();
      if (process.env.NODE_ENV === 'development') {
        return res.status(500).json(erros);
      }
      return res.status(500).json({ error: 'internal Server Error' });
    });
  }
}

export default new App().server;
