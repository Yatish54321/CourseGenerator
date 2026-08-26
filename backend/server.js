require('dotenv').config();
const app = require('./src/app');

const MAX_PORT_ATTEMPTS = 10;

function startServer(port, attempt = 1) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Retrying on port ${nextPort}...`);
      startServer(nextPort, attempt + 1);
      return;
    }

    console.error('Failed to start backend server:', error.message);
    process.exit(1);
  });
}

const PORT = Number(process.env.PORT) || 5000;
startServer(PORT);
