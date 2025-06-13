import { Currency } from "../models/currency"

export interface CurrencyData {
  code: string
  name: string
  symbol: string
}

export const DEFAULT_CURRENCIES: Record<string, CurrencyData> = {
  BRL: {
    code: "BRL",
    name: "Real Brasileiro",
    symbol: "R$",
  },
  COP: {
    code: "COP",
    name: "Peso Colombiano",
    symbol: "$",
  },
  USD: {
    code: "USD",
    name: "Dólar Americano",
    symbol: "$",
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
  },
} as const

export const CurrencyFactory = {
  createFromCode(code: string): Currency {
    const currencyData = DEFAULT_CURRENCIES[code]
    if (!currencyData) {
      throw new Error(`Unsupported currency code: ${code}`)
    }
    return Currency.create(currencyData)
  },

  createFromData(data: CurrencyData): Currency {
    return Currency.create(data)
  },

  createBRL(): Currency {
    return this.createFromCode("BRL")
  },

  createCOP(): Currency {
    return this.createFromCode("COP")
  },

  createUSD(): Currency {
    return this.createFromCode("USD")
  },

  createEUR(): Currency {
    return this.createFromCode("EUR")
  },

  getSupportedCurrencies(): Currency[] {
    return Object.keys(DEFAULT_CURRENCIES).map(code =>
      this.createFromCode(code)
    )
  },

  isSupportedCurrency(code: string): boolean {
    return code in DEFAULT_CURRENCIES
  },

  getCurrencyData(code: string): CurrencyData | null {
    return DEFAULT_CURRENCIES[code] || null
  },
}
