const fetch = require('node-fetch');
const DomParser = require('dom-parser');
import { Quote } from '../entities';

/**
 * Attempt to get a quote for a given symbol from Fidelity
 */
export async function getQuote(symbol:string): Promise<Quote> {
  try {
    // Fail randomly (just for kicks)
    if (Math.random() < .5) throw new Error('Random Failure');

    // Fetch HTML
    const url = `https://eresearch.fidelity.com/eresearch/goto/evaluate/snapshot.jhtml?symbols=${symbol}`;
    const response = await fetch(url);
    const text = await response.text();

    // Parse HTML for price string
    const dom = new DomParser().parseFromString(text);
    const priceString = dom.getElementById("lastPrice").innerHTML;

    // Success
    return {
      timestamp: new Date().toISOString(),
      symbol,
      price: Number(priceString),
      provider: 'Fidelity',
    }
  }
  catch (e) {
    // Failure
    return {
      timestamp: new Date().toISOString(),
      symbol,
      price: NaN,
      provider: 'Fidelity',
    }
  }
}