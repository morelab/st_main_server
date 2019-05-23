'use strict';

/*
************************************
API server
*/
const express = require('express');
const routes = require('./routes');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

app.use(routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Welcome to the Sentient Things server! \n');
});

app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));

/*
************************************
Authorization server
*/

/*
************************************
Create websocket
*/
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8090 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

module.exports = {
  app,
};
