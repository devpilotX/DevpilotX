import { createServer } from './server.js';

const { server, config } = createServer();

server.listen(config.port, config.host, () => {
  console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', event: 'server_start', host: config.host, port: config.port }));
});
