/**
 * The Quote Delegator receives quote requests in the form of strings that
 * represent an asset. The Quote Delegator is responsible for managing a list
 * of Quote Providers that can create quotes.
 * 
 * The Quote Delegator must also decide which providers should be utilized
 * based on their recent performance. Quote Providers are inherently unstable
 * and will inevitably require repair or replacement over time.
 */

 // Dependencies
import { Quote, QuoteDelegator, QuoteProvider } from './entities';
const quoteProviders: QuoteProvider[] = [
  require('./quote-providers/fidelity'),
  require('./quote-providers/marketwatch'),
]

// Export Object
export const quoteDelegator: QuoteDelegator = {
  getQuote,
}

// Try to get quotes from a list of providers
// Only ask multiple providers if previous providers have failed
async function getQuote(symbol:string): Promise<Quote> {
  for (const provider of quoteProviders) {
    const quote = await provider.getQuote(symbol);
    if (false == Number.isNaN(quote.price)) return quote;
  }
}

