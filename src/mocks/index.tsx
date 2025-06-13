import { CountryFactory } from "../factories/country-factory"
import { CurrencyFactory } from "../factories/currency-factory"
import type { Transaction } from "../models/transaction"

// Mock do modelo Transaction
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    description: "Compra no supermercado",
    amount: 150.75,
    currency: CurrencyFactory.createBRL(),
    date: new Date("2025-06-01T10:00:00Z"),
    country: CountryFactory.createBrazil(),
    createdAt: new Date("2025-06-01T10:00:00Z"),
  },
  {
    id: "2",
    description: "Assinatura de streaming",
    amount: 39.9,
    currency: CurrencyFactory.createBRL(),
    date: new Date("2025-06-02T15:30:00Z"),
    country: CountryFactory.createBrazil(),
    createdAt: new Date("2025-06-02T15:30:00Z"),
  },
  {
    id: "3",
    description: "Pagamento de serviço",
    amount: 200.0,
    currency: CurrencyFactory.createUSD(),
    date: new Date("2025-06-03T09:15:00Z"),
    country: CountryFactory.createColombia(),
    createdAt: new Date("2025-06-03T09:15:00Z"),
  },
  {
    id: "4",
    description: "Pagamento de serviço",
    amount: 200.0,
    currency: CurrencyFactory.createUSD(),
    date: new Date("2025-06-04T10:00:00Z"),
    country: CountryFactory.createColombia(),
    createdAt: new Date("2025-06-04T10:00:00Z"),
  },
  {
    id: "5",
    description: "Pagamento de serviço",
    amount: 200.0,
    currency: CurrencyFactory.createBRL(),
    date: new Date("2025-06-04T10:00:00Z"),
    country: CountryFactory.createBrazil(),
    createdAt: new Date("2025-06-04T10:00:00Z"),
  },
]

export const MOCK_LOADING = false
export const MOCK_ERROR = null

// Mock de taxas de câmbio
export const MOCK_RATES: Record<string, number> = {
  BRL: 5.5,
  COP: 4000,
  USD: 1,
}
