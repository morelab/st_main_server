/** @format */

import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from '../routes';

const server = express();

server.use(helmet());
server.use(cors());
if (process.env.NODE_ENV !== 'test') {
  server.use(morgan('dev'));
}

server.use(cookieParser());
server.use(bodyParser.json());

routes(server);
export default server;
