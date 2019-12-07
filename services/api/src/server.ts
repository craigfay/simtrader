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
            cash
          }
        }
      `
    })
  });

  const { data } = await actorLookupResponse.json();
  console.log({ actorData: data });
  if (!data) return 500;
  if (!data.actorById) return http.response({ status: 400, body: 'Invalid actorId' });

  if (data.actorById.cash < quote) {
    return http.response({ status: 400, body: 'Insufficient funds '});
  }

  console.log('Sufficient Funds!', quote, data.actorById);

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
  if (!positionData.allPositions.nodes.length) {
    // Position does not exist
    const [position, err] = await createNewPosition(actorId, symbol, quantity);
    if (position && !err) return position;
    else return http.response({ status: 500, body: err });

  } else {
    const { nodeId, quantity: exitingQuantity } = positionData.allPositions.nodes[0];
    const [position, err] = await updateExistingPositionQuantity(nodeId, quantity + exitingQuantity);
    if (position && !err) return position;
    else return http.response({ status: 500, body: err });
  }
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

async function updateExistingPositionQuantity(nodeId:string, quantity:string) {
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
