// make schema README
import * as http from  '@node-scarlet/http';
import * as quoteDelegator from './quote-delegator';
import fetch from 'node-fetch';

export function makeHttpServer(data) {
  const requests = http.server();
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
  const { actor_id, symbol, quantity } = req.body;
  if (!actor_id) return http.response({ status: 400, body: 'Missing actor_id' });
  if (!symbol) return http.response({ status: 400, body: 'Missing symbol' });
  if (!quantity) return http.response({ status: 400, body: 'Missing quantity' });

  const quote = await quoteDelegator.getQuote(symbol);
  if (!quote) return http.response({ status: 400, body: 'Invalid Symbol' });

  const actorLookupResponse = await fetch('graphql:5000/graphql', {
    headers: { 'content/type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          actorById(id: ${actor_id}) {
            cash
          }
        }
      `
    })
  })

  const { data } = await actorLookupResponse.json();
  if (!data) return 500;
  if (!data.actorById) return http.response({ status: 400, body: 'Invalid actor_id' });

  const cash = data.actorById.cash;
}
