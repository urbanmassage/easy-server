const debug = require('debug')('easy-server');
import express = require('express');
import MiddlewareManager = require('middleware-manager');

import start = require('./start');
import { Options, Server } from './shared/server';

function easyServer(options: Options): Server {
  const app: Server = <any>express();

  app.start = start.bind(null, app);

  app.easyOptions = {
    middleware: './app/middleware',
    controllers: './app/controllers',
    port: 8080,
    autoStart: true,
    debug,
    extensions: ['.js'],
    keepAliveTimeout: 120000,
  };

  Object.keys(options).forEach(key => {
    if (options.hasOwnProperty(key)) {
      app.easyOptions[key] = options[key];
    }
  });

  (app as any).on('connection', function (socket) {
    socket.setTimeout(app.easyOptions.keepAliveTimeout);
  });

  app.debug = app.easyOptions.debug;

  app.middleware = new MiddlewareManager();

  if (app.easyOptions.autoStart === true) {
    app.start();
  }

  if (app.easyOptions.cors === true) {
    app.use(require('./shared/cors'));
    app.debug('Added CORS middleware');
  }

  return app;
}

module easyServer {
  export interface Application extends Server { }
}

export = easyServer;
