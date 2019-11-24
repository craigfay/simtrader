// const quoteDelegator = require('./quote-delegator');
const { database } = require('@lepton/db');
const { datapath } = require('../data/path');
const { makeHttpServer } = require('./server');

function main() {
  const data = database(datapath);
  const server = makeHttpServer(data);
  server.listen(80);
}

main();

// Demonstrate Quote Providers
// (async function main() {
//   for (let i = 0; i < 10; i++) {
//     console.log(await quoteDelegator.getQuote('MSFT'));
//   }
// })()
