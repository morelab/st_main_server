const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const swagger = require('swagger-ui-express');
const swaggerDocument = require('../api/openapi.json');

const app = express();
dotenv.config();
require('./database/database');

// Settings
app.set('port', process.env.PORT || 8876);

// Middlewares
app.use(morgan('dev'));
app.use(cookieParser());
//TODO: Cambiar cuando se tenga que implementar
app.use(cors());
app.use(express.json());

// Routes
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument));
app.use('/', require('./routes/index'));

// Start the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
