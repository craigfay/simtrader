const fetch = require('node-fetch');
import { Quote } from '../entities';

/**
 * Attempt to get a quote for a given symbol from Marketwatch
 */
export async function getQuote(symbol): Promise<Quote> {
  try {
    // Fetch HTML
    const url = `https://www.marketwatch.com/investing/stock/${symbol}`;
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse HTML for price string
    const [,rest] = text.split("session=\"after\">");
    const [priceString] = rest.split("</bg-quote>")

    return {
      timestamp: new Date().toISOString(),
      symbol,
      price: Number(priceString),
      provider: "MarketWatch",
    }
  }
  catch (e) {
    return {
      timestamp: new Date().toISOString(),
      symbol,
      price: NaN,
      provider: 'MarketWatch',
    }
  }
}
