import { database } from '@lepton/db';

(async function migrate() {
  const data = await database(__dirname + '/data');

  // Define Tables
  await data.commit(
    data.define('actors', {
      referenceField: 'actorId'
    }),
    data.define('transactions', {
      referenceField: 'transactionId'
    }),
    data.define('positions', {
      referenceField: 'positionId'
    }),
  );
})();