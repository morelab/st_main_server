/** @format */

import server from './server';
import logger from './utils/logger';
import { port } from './configuration/configuration';

server.listen(port, () => {
  logger.info(`Server listening at port ${port}`);
});
