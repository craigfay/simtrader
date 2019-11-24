// make schema README
import * as http from  '@node-scarlet/http';
import * as quoteDelegator from './quote-delegator';

export function makeHttpServer(data) {
  const requests = http.server();
  requests.route('GET', '/quote/:symbol', quoteRetrievalHandler);
  requests.route('GET', '/*', () => 404);

  return {
    listen: port => requests.listen(port),
    close: () => requests.close(),
  }
}

async function quoteRetrievalHandler(req, meta) {
  const { symbol } = req.params;
  if (symbol) return;

  const quote = await quoteDelegator.getQuote('MSFT');
  if (quote) return { quote };
}
