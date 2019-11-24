export interface Position {
  id: string
  symbol: string
  quantity: number
}

export interface Actor {
  id: string
  cash: number
  positionId: string
}

export interface Quote {
  timestamp: string
  symbol: string
  price: number
  provider: string
}

export interface QuoteProvider {
  getQuote: (symbol:string) => Promise<Quote>
}

export interface Failure {
  timestamp: string
  type: string
  details: string
}

export interface QuoteDelegator {
  getQuote: (symbol:string) => Promise<Quote>
}

export interface Transaction {
  id: string
  actorId: string
  timestamp: string
  action: "buy" | "sell"
  symbol: string
  quantity: number
  price: number
}

export interface Transactor {
  buy: (symbol:string, actorId:string) => Promise<Transaction | Failure>;
  sell: (symbol:string, actorId:string) => Promise<Transaction | Failure>;
}
