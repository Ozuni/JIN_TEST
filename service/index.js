const server = require('./server');

function handleExit() {
  server.stop();
  process.exit();
}

server.start().then(() => {
  console.log('Service started');
  process.on('SIGINT', handleExit);
}).catch((err) => {
  console.log(`Fatal error: ${err}`)
})
