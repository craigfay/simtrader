import * as fetch from 'node-fetch';
import { makeHttpServer } from './server';

const mockDatabase = {
  read: readMockData,
  alter: alterMockData,
  commit: commitMockData,
}

function readMockData() {
  return {
    "483kpaf7cm3ip40t": {
      "cash": 3816,
      "key": "qro6w7cry0cjzmfsibs0oflfcc8yu6wi"
    },
    "95t0oc4o0gwjfp0d": {
      "cash": 20002,
      "key": "dh8qf915andk6v46cefmvigvwuygf0tf"
    }
  }
}

function alterMockData(table, { id, fields }) {
  return { mutation: 'alter', table, payload: { id, fields } }
}

async function commitMockData(...cms) {
  const affectedRecords = { [cms[0].payload.id]: cms[0].payload.fields }
  const errors = [];
  return [affectedRecords, errors]
}

// Retrieve all actors
async function manyActorRetrievalHandlerTest() {
  const server = makeHttpServer(mockDatabase);
  server.listen(80);

  const response = await fetch('http://0.0.0.0/actors', {});
  const actors = await response.json();
  if (actors["483kpaf7cm3ip40t"]["cash"] !== 3816) {
    throw new Error('GET /actors did not function as expected');
  }
  server.close();
}

// Retrieve a single actor by id
async function actorRetrievalHandlerTest() {
  const server = makeHttpServer(mockDatabase);
  server.listen(80);

  const response = await fetch('http://0.0.0.0/actors/483kpaf7cm3ip40t', {});
  const actor = await response.json();
  if (actor["cash"] !== 3816) {
    throw new Error('GET /actors/:id did not function as expected');
  }
  server.close();
}

// Retrieve a single actor by id
async function actorAlterationHandlerTest() {
  const server = makeHttpServer(mockDatabase);
  server.listen(80);

  const response = await fetch('http://0.0.0.0/actors/483kpaf7cm3ip40t', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ cash: 4000 })
  });

  const actor = await response.json();
  if (actor["cash"] !== 4000) {
    throw new Error('PUT /actors/:id did not function as expected');
  }
  server.close();
}

// All Tests
export const tests = [
  manyActorRetrievalHandlerTest,
  actorRetrievalHandlerTest,
  actorAlterationHandlerTest,
]