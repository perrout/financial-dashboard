import type { Country } from "./country"
import type { Currency } from "./currency"

export interface Transaction {
  id: string
  description?: string
  amount: number
  currency: Currency
  date: Date
  country: Country
  createdAt: Date
}

export interface CountryBalance {
  country: Country
  balances: CurrencyBalance[]
  totalTransactions: number
}

export interface CurrencyBalance {
  currency: Currency
  amount: number
  transactionCount: number
}

export interface DailyTransactionSummary {
  date: string
  totalAmount: number
  transactionCount: number
  currency: Currency
}
