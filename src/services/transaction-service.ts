import type { Transaction } from "@/models/transaction"
import type { Country } from "@/models/country"
import type { Currency } from "@/models/currency"
import { MockTransactionApi } from "@/mocks/mock-transaction-api"
import { FormatterService } from "@/services/formatter-service"

export interface DailyTransactionSummary {
  date: string
  totalAmount: number
  transactionCount: number
  currency: Currency
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

export interface TransactionFilters {
  countryCode?: string
  currencyCode?: string
  dateFrom?: Date
  dateTo?: Date
  description?: string
}

export class TransactionService {
  async createTransaction(data: {
    description?: string
    amount: number
    currencyCode: string
    date: Date
    countryCode: string
  }): Promise<Transaction> {
    return await MockTransactionApi.create({
      ...data,
      date: data.date,
    })
  }

  async createTransactionFromForm(
    formData: {
      description: string
      amount: string
      currency: string
      date: string
    },
    country: Country
  ): Promise<Transaction> {
    return await MockTransactionApi.create({
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      currencyCode: formData.currency,
      date: formData.date,
      countryCode: country.code,
    })
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return await MockTransactionApi.getById(id)
  }

  async getAllTransactions(
    _filters?: TransactionFilters
  ): Promise<Transaction[]> {
    return await MockTransactionApi.getAll()
  }

  async getTransactionsByCountry(countryCode: string): Promise<Transaction[]> {
    return await MockTransactionApi.getByCountry(countryCode)
  }

  async getTransactionsByCurrency(
    currencyCode: string
  ): Promise<Transaction[]> {
    return await MockTransactionApi.getByCurrency(currencyCode)
  }

  async updateTransaction(
    id: string,
    updates: {
      description?: string
      amount?: number
      currencyCode?: string
      date?: Date
      countryCode?: string
    }
  ): Promise<Transaction> {
    const updated = await MockTransactionApi.update(id, updates)
    if (!updated) {
      throw new Error(`Transaction with id ${id} not found`)
    }
    return updated
  }

  async deleteTransaction(id: string): Promise<boolean> {
    return await MockTransactionApi.delete(id)
  }

  async getDailySummaryByCountry(
    countryCode: string
  ): Promise<DailyTransactionSummary[]> {
    const transactions = await this.getTransactionsByCountry(countryCode)
    return this.calculateDailySummary(transactions)
  }

  async getCountryBalance(countryCode: string): Promise<CountryBalance | null> {
    const transactions = await this.getTransactionsByCountry(countryCode)
    if (transactions.length === 0) {
      return null
    }
    return this.calculateCountryBalance(transactions)
  }

  calculateCountryBalance(transactions: Transaction[]): CountryBalance {
    const country = transactions[0].country
    const currencyBalances = new Map<string, CurrencyBalance>()

    for (const transaction of transactions) {
      const currencyCode = transaction.currency.code
      const existing = currencyBalances.get(currencyCode)

      if (existing) {
        existing.amount += transaction.amount
        existing.transactionCount += 1
      } else {
        currencyBalances.set(currencyCode, {
          currency: transaction.currency,
          amount: transaction.amount,
          transactionCount: 1,
        })
      }
    }

    return {
      country,
      balances: Array.from(currencyBalances.values()),
      totalTransactions: transactions.length,
    }
  }

  async getTotalBalanceByCountryAndCurrency(
    countryCode: string,
    currencyCode: string
  ): Promise<number> {
    const all = await MockTransactionApi.getAll()
    const filtered = all.filter(
      t => t.country.code === countryCode && t.currency.code === currencyCode
    )
    return filtered.reduce(
      (total, transaction) => total + transaction.amount,
      0
    )
  }

  async getTransactionsInDateRange(
    countryCode: string,
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    const all = await this.getTransactionsByCountry(countryCode)
    return all.filter(t => t.date >= startDate && t.date <= endDate)
  }

  calculateDailySummary(
    transactions: Transaction[]
  ): DailyTransactionSummary[] {
    const dailyMap = new Map<
      string,
      {
        date: string
        totalAmount: number
        transactionCount: number
        currency: Currency
      }
    >()

    for (const transaction of transactions) {
      const dateKey = FormatterService.formatISODate(transaction.date)
      const existing = dailyMap.get(dateKey)

      if (existing) {
        existing.totalAmount += transaction.amount
        existing.transactionCount += 1
      } else {
        dailyMap.set(dateKey, {
          date: dateKey,
          totalAmount: transaction.amount,
          transactionCount: 1,
          currency: transaction.currency,
        })
      }
    }

    return Array.from(dailyMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }

  async clearAllTransactions(): Promise<void> {
    await MockTransactionApi.clear()
  }

  async getStatistics(countryCode?: string): Promise<{
    totalTransactions: number
    totalCountries: number
    totalCurrencies: number
    averageTransactionAmount: number
  }> {
    const all = countryCode
      ? await this.getTransactionsByCountry(countryCode)
      : await MockTransactionApi.getAll()

    const countries = new Set(all.map(t => t.country.code))
    const currencies = new Set(all.map(t => t.currency.code))
    const totalAmount = all.reduce((sum, t) => sum + t.amount, 0)

    return {
      totalTransactions: all.length,
      totalCountries: countries.size,
      totalCurrencies: currencies.size,
      averageTransactionAmount: all.length > 0 ? totalAmount / all.length : 0,
    }
  }
}
