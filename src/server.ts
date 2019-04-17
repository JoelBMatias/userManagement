import { log } from './loggerconf';

const server = require('./app');

const PORT = 8080;
const port = process.env.PORT || PORT;

server.listen(port, () => {
  log.info(`SERVER LISTENING ON PORT ${port}`);
});
