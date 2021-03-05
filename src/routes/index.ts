/** @format */

import applicationRoutes from './app/application.routes';
import authenticationRoutes from './authentication/authentication.routes';
import userRoutes from './users/users.routes';

const routes = (server: any) => {
  server.use('/api', applicationRoutes);
  server.use('/auth', authenticationRoutes);
  server.use('/user', userRoutes);
};
export default routes;
