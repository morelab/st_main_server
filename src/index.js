const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();
require('./database/database');

// Settings
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(morgan('dev'));
app.use(cookieParser());
//TODO: Cambiar cuando se tenga que implementar
app.use(cors({origin: 'http://localhost:3000', credentials: true}))
// app.use(cors({ origin: '192.168.0.28', credentials: true }));
app.use(express.json());

// Routes
app.use('/', require('./routes/index'));

// Start the server
app.listen(app.get('port'), () => {
	console.log(`Server on port ${app.get('port')}`);
});
