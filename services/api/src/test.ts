const { run, testSuite } = require('waverunner');

run(testSuite(
  require('./server.test'),
))