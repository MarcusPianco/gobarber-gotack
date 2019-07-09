import express from 'express';

import path from 'path';
import routes from './routes';
import './database';

const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'https://6a7e5c9b629c4428b8f685cc90d3922b@sentry.io/1499929',
});

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.server.use(Sentry.Handlers.errorHandler());
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
  }
}

export default new App().server;
