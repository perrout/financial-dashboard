import type { Country } from "@/models/country"
import { Transaction } from "@/models/transaction"
import { FormatterService } from "@/services/formatter-service"
import { CountryFactory, type CountryCode } from "./country-factory"
import { CurrencyFactory } from "./currency-factory"

export interface CreateTransactionData {
  description?: string
  amount: number
  currencyCode: string
  date: Date | string
  countryCode: string
}

export interface TransactionData {
  id: string
  description?: string
  amount: number
  currencyCode: string
  date: Date | string
  countryCode: string
  createdAt: Date | string
}

export const TransactionFactory = {
  createFromData(data: CreateTransactionData): Transaction {
    const currency = CurrencyFactory.createFromCode(data.currencyCode)
    const country = CountryFactory.createFromCode(
      data.countryCode as CountryCode
    )
    const date = typeof data.date === "string" ? new Date(data.date) : data.date

    return Transaction.create({
      description: data.description,
      amount: data.amount,
      currency,
      date,
      country,
    })
  },

  createFromFormData(
    formData: {
      description: string
      amount: string
      currency: string
      date: string
    },
    country: Country
  ): Transaction {
    const currency = CurrencyFactory.createFromCode(formData.currency)
    const date = new Date(formData.date)
    const amount = Number.parseFloat(formData.amount)

    return Transaction.create({
      description: formData.description || undefined,
      amount,
      currency,
      date,
      country,
    })
  },

  recreateFromStorage(data: TransactionData): Transaction {
    const currency = CurrencyFactory.createFromCode(data.currencyCode)
    const country = CountryFactory.createFromCode(
      data.countryCode as CountryCode
    )
    const date = typeof data.date === "string" ? new Date(data.date) : data.date
    const createdAt =
      typeof data.createdAt === "string"
        ? new Date(data.createdAt)
        : data.createdAt

    return Transaction.fromData({
      id: data.id,
      description: data.description,
      amount: data.amount,
      currency,
      date,
      country,
      createdAt,
    })
  },

  createSampleTransactions(): Transaction[] {
    const brazil = CountryFactory.createBrazil()
    const colombia = CountryFactory.createColombia()
    const brl = CurrencyFactory.createBRL()
    const cop = CurrencyFactory.createCOP()
    const usd = CurrencyFactory.createUSD()

    return [
      Transaction.create({
        description: "Compra supermercado",
        amount: 250.75,
        currency: brl,
        date: FormatterService.parseISODate("2025-06-12"),
        country: brazil,
      }),
      Transaction.create({
        description: "Freelance web development",
        amount: 1500.0,
        currency: brl,
        date: FormatterService.parseISODate("2025-06-11"),
        country: brazil,
      }),
      Transaction.create({
        description: "Almuerzo restaurante",
        amount: 85000,
        currency: cop,
        date: FormatterService.parseISODate("2025-06-11"),
        country: colombia,
      }),
      Transaction.create({
        description: "Salary payment",
        amount: 3500.0,
        currency: usd,
        date: FormatterService.parseISODate("2025-06-10"),
        country: brazil,
      }),
      Transaction.create({
        description: "Consultoría técnica",
        amount: 450000,
        currency: cop,
        date: FormatterService.parseISODate("2025-06-09"),
        country: colombia,
      }),
      Transaction.create({
        description: "Consultoría técnica",
        amount: 100000,
        currency: brl,
        date: FormatterService.parseISODate("2025-06-08"),
        country: brazil,
      }),
    ]
  },

  createBulkFromData(dataList: CreateTransactionData[]): Transaction[] {
    return dataList.map(data => TransactionFactory.createFromData(data))
  },

  validateTransactionData(data: CreateTransactionData): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (data.amount <= 0) {
      errors.push("Amount must be positive")
    }

    if (!CurrencyFactory.isSupportedCurrency(data.currencyCode)) {
      errors.push(`Unsupported currency: ${data.currencyCode}`)
    }

    if (!CountryFactory.isSupportedCountry(data.countryCode)) {
      errors.push(`Unsupported country: ${data.countryCode}`)
    }

    const date = typeof data.date === "string" ? new Date(data.date) : data.date
    if (Number.isNaN(date.getTime())) {
      errors.push("Invalid date")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },
}
