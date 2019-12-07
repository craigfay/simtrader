// make schema README
import * as http from  '@node-scarlet/http';
import * as quoteDelegator from './quote-delegator';
import fetch from 'node-fetch';

export function makeHttpServer(data) {
  const requests = http.server();
  requests.route('GET', '/ping', () => 200);
  requests.route('GET', '/quote/:symbol', quoteRetrievalHandler);
  requests.route('POST', '/transactions/buy', buyHandler);
  requests.route('GET', '/*', () => 404);

  return {
    listen: port => requests.listen(port),
    close: () => requests.close(),
  }
}

async function quoteRetrievalHandler(req, meta) {
  const { symbol } = req.params;
  if (symbol) return;

  const quote = await quoteDelegator.getQuote(symbol);
  if (quote) return { quote };
}

async function buyHandler(req, meta) {
  const { actorId, symbol, quantity } = req.body;
  if (!actorId) return http.response({ status: 400, body: 'Missing actorId' });
  if (!symbol) return http.response({ status: 400, body: 'Missing symbol' });
  if (!quantity) return http.response({ status: 400, body: 'Missing quantity' });

  const quote = await quoteDelegator.getQuote(symbol);
  if (!quote) return http.response({ status: 400, body: 'Invalid Symbol' });

  const actorLookupResponse = await fetch('http://graphql:5000/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          actorById(id: ${actorId}) {
            nodeId
            cash
          }
        }
      `
    })
  });

  const { data } = await actorLookupResponse.json();
  if (!data) return 500;
  if (!data.actorById) return http.response({ status: 400, body: 'Invalid actorId' });
  const { nodeId: actorNodeId, cash } = data.actorById;

  console.log({ cash, price: quote.price, quantity })

  if (cash < quote.price * quantity) {
    return http.response({ status: 400, body: 'Insufficient funds '});
  }

  const positionResponse = await fetch('http://graphql:5000/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          allPositions(
            first: 1
            condition: {
              symbol: ${JSON.stringify(symbol)}
              actorId: ${JSON.stringify(actorId)}
            }
          ) {
            nodes {
              nodeId
              quantity
            }
          }
        }
      `
    })
  });

  const positionData = (await positionResponse.json()).data;
  let position;

  // Must create new position
  if (!positionData.allPositions.nodes.length) {
    const [newPosition, err] = await createNewPosition(actorId, symbol, quantity);
    if (err) return http.response({ status: 500, body: err });
    position = newPosition;
  }
  // Must update existing position
  else {
    const [existingPosition] = positionData.allPositions.nodes;
    const { nodeId: positionId, quantity: exitingQuantity } = existingPosition;
    const newQuantity = quantity + exitingQuantity;
    const [positionPatch, err] = await updatePositionQuantity(positionId, newQuantity);
    if (err) return http.response({ status: 500, body: err.message });
    position = positionPatch;
  }

  // Deduct actor cash
  const cashSpent = quote.price * quantity;
  const cashRemaining = cash - cashSpent;
  const [actor, err] = await updateActorCash(actorNodeId, cashRemaining);
  if (err) return http.response({ status: 500, body: err.message });

  // Success
  return http.response({
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ actor, position })
  });

}

async function createNewPosition(actorId:number, symbol:string, quantity:string) {
  const positionResponse = await fetch('http://graphql:5000/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          createPosition(input: {
            position: {
              actorId: ${JSON.stringify(actorId)}
              symbol: ${JSON.stringify(symbol)}
              quantity: ${JSON.stringify(quantity)}
            }
          }) {
            position {
              actorId
              symbol
              quantity
            }
          }
        }
      `
    })
  });

  const { data } = await positionResponse.json();
  if (data && data.createPosition && data.createPosition.position) {
    const { position } = data.createPosition;
    return [position, null];
  }
  else {
    const err = new Error('Could not create position');
    return [null, err];
  }
}

async function updatePositionQuantity(nodeId:string, quantity:string) {
  const positionResponse = await fetch('http://graphql:5000/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          updatePosition(input: {
            nodeId: ${JSON.stringify(nodeId)}
            positionPatch: {
              quantity: ${JSON.stringify(quantity)}
            }
          }) {
            position {
              actorId
              symbol
              quantity
            }
          }
        }
      `
    })
  });

  const { data } = await positionResponse.json();
  if (data && data.updatePosition && data.updatePosition.position) {
    const { position } = data.updatePosition;
    return [position, null];
  }
  else {
    const err = new Error('Could not update position');
    return [null, err];
  }
}

async function updateActorCash(nodeId:string, cash:number) {
  const response = await fetch('http://graphql:5000/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          updateActor(input: {
            nodeId: ${JSON.stringify(nodeId)}
            actorPatch: {
              cash: ${JSON.stringify(cash)}
            }
          }) {
            actor {
              cash
            }
          }
        }
      `
    })
  });

  const { data } = await response.json();
  if (data && data.updateActor && data.updateActor.actor) {
    const { actor } = data.updateActor;
    return [actor, null];
  }
  else {
    const err = new Error('Could not update actor');
    return [null, err];
  }
}


