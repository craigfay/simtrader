const { makeHttpServer } = require('./server');

function main() {
  const server = makeHttpServer();
  server.listen(80);
  console.log('...');
}

main();
