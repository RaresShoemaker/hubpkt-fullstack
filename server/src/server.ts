import { app } from "./app";
import http from 'http';
import {config} from './config/environment';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
