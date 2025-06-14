import { describe, it, expect, beforeEach } from "vitest"
import { TransactionFactory } from "@/factories/transaction-factory"
import { CountryFactory } from "@/factories/country-factory"
import type { Country } from "@/models/country"

describe("TransactionFactory", () => {
  let mockCountry: Country

  beforeEach(() => {
    mockCountry = CountryFactory.createBrazil()
  })

  describe("createFromFormData", () => {
    it("should create transaction from form data", () => {
      const formData = {
        description: "Test transaction",
        amount: "100.50",
        currency: "BRL",
        date: "202-01-01",
      }

      const transaction = TransactionFactory.createFromFormData(
        formData,
        mockCountry
      )

      expect(transaction.description).toBe("Test transaction")
      expect(transaction.amount).toBe(100.5)
      expect(transaction.currency.code).toBe("BRL")
      expect(transaction.country).toBe(mockCountry)
    })

    it("should handle empty description", () => {
      const formData = {
        description: "",
        amount: "100",
        currency: "BRL",
        date: "202-01-01",
      }

      const transaction = TransactionFactory.createFromFormData(
        formData,
        mockCountry
      )
      expect(transaction.description).toBeUndefined()
    })

    it("should parse amount correctly", () => {
      const formData = {
        description: "Test",
        amount: "1234.56",
        currency: "BRL",
        date: "202-01-01",
      }

      const transaction = TransactionFactory.createFromFormData(
        formData,
        mockCountry
      )
      expect(transaction.amount).toBe(1234.56)
    })

    it("should create transaction with NaN amount for invalid amount string", () => {
      const formData = {
        description: "Test",
        amount: "invalid",
        currency: "BRL",
        date: "202-01-01",
      }

      const transaction = TransactionFactory.createFromFormData(
        formData,
        mockCountry
      )
      expect(transaction.amount).toBeNaN()
    })

    it("should throw error for negative amount during Transaction.create", () => {
      const formData = {
        description: "Test",
        amount: "-100",
        currency: "BRL",
        date: "202-01-01",
      }

      expect(() => {
        TransactionFactory.createFromFormData(formData, mockCountry)
      }).toThrow("Transaction amount must be positive")
    })

    it("should throw error for unsupported currency", () => {
      const formData = {
        description: "Test",
        amount: "100",
        currency: "XYZ",
        date: "202-01-01",
      }

      expect(() => {
        TransactionFactory.createFromFormData(formData, mockCountry)
      }).toThrow("Unsupported currency code: XYZ")
    })

    it("should create transaction with invalid date", () => {
      const formData = {
        description: "Test",
        amount: "100",
        currency: "BRL",
        date: "invalid-date",
      }

      const transaction = TransactionFactory.createFromFormData(
        formData,
        mockCountry
      )
      expect(transaction.date).toBeInstanceOf(Date)
      expect(transaction.date.toString()).toBe("Invalid Date")
    })
  })

  describe("createFromData", () => {
    it("should create transaction from data object", () => {
      const data = {
        description: "Test transaction",
        amount: 100.5,
        currencyCode: "BRL",
        date: new Date("2025-01-01"),
        countryCode: "BR",
      }

      const transaction = TransactionFactory.createFromData(data)

      expect(transaction.description).toBe("Test transaction")
      expect(transaction.amount).toBe(100.5)
      expect(transaction.currency.code).toBe("BRL")
      expect(transaction.country.code).toBe("BR")
    })

    it("should handle string dates", () => {
      const data = {
        description: "Test",
        amount: 100,
        currencyCode: "BRL",
        date: "2025-06-15T12:00:00.000Z",
        countryCode: "BR",
      }

      const transaction = TransactionFactory.createFromData(data)
      expect(transaction.date).toBeInstanceOf(Date)
      expect(transaction.date.getFullYear()).toBe(2025)
      expect(transaction.date.getMonth()).toBe(5)
    })
  })

  describe("createSampleTransactions", () => {
    it("should create sample transactions", () => {
      const transactions = TransactionFactory.createSampleTransactions()

      expect(transactions).toHaveLength(6)

      for (const transaction of transactions) {
        expect(transaction.id).toBeDefined()
        expect(transaction.amount).toBeGreaterThan(0)
        expect(transaction.currency).toBeDefined()
        expect(transaction.country).toBeDefined()
        expect(transaction.date).toBeInstanceOf(Date)
      }
    })

    it("should create transactions with different currencies", () => {
      const transactions = TransactionFactory.createSampleTransactions()
      const currencies = new Set(transactions.map(t => t.currency.code))

      expect(currencies.size).toBeGreaterThan(1)
      expect(currencies.has("BRL")).toBe(true)
      expect(currencies.has("COP")).toBe(true)
      expect(currencies.has("USD")).toBe(true)
    })

    it("should create transactions for different countries", () => {
      const transactions = TransactionFactory.createSampleTransactions()
      const countries = new Set(transactions.map(t => t.country.code))

      expect(countries.size).toBe(2)
      expect(countries.has("BR")).toBe(true)
      expect(countries.has("CO")).toBe(true)
    })
  })

  describe("validateTransactionData", () => {
    it("should validate correct transaction data", () => {
      const data = {
        description: "Test",
        amount: 100,
        currencyCode: "BRL",
        date: new Date("202-01-01"),
        countryCode: "BR",
      }

      const result = TransactionFactory.validateTransactionData(data)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should reject negative amounts", () => {
      const data = {
        description: "Test",
        amount: -100,
        currencyCode: "BRL",
        date: new Date("202-01-01"),
        countryCode: "BR",
      }

      const result = TransactionFactory.validateTransactionData(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Amount must be positive")
    })

    it("should reject truly unsupported currency", () => {
      const data = {
        description: "Test",
        amount: 100,
        currencyCode: "XYZ",
        date: new Date("202-01-01"),
        countryCode: "BR",
      }

      const result = TransactionFactory.validateTransactionData(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Unsupported currency: XYZ")
    })

    it("should accept EUR as supported currency", () => {
      const data = {
        description: "Test",
        amount: 100,
        currencyCode: "EUR",
        date: new Date("202-01-01"),
        countryCode: "BR",
      }

      const result = TransactionFactory.validateTransactionData(data)
      expect(result.isValid).toBe(true)
    })

    it("should reject unsupported country", () => {
      const data = {
        description: "Test",
        amount: 100,
        currencyCode: "BRL",
        date: new Date("202-01-01"),
        countryCode: "FR",
      }

      const result = TransactionFactory.validateTransactionData(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Unsupported country: FR")
    })

    it("should reject invalid dates", () => {
      const data = {
        description: "Test",
        amount: 100,
        currencyCode: "BRL",
        date: "invalid-date",
        countryCode: "BR",
      }

      const result = TransactionFactory.validateTransactionData(data)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Invalid date")
    })
  })

  describe("createBulkFromData", () => {
    it("should create multiple transactions from data array", () => {
      const dataList = [
        {
          description: "Transaction 1",
          amount: 100,
          currencyCode: "BRL",
          date: new Date("202-01-01"),
          countryCode: "BR",
        },
        {
          description: "Transaction 2",
          amount: 200,
          currencyCode: "COP",
          date: new Date("202-01-02"),
          countryCode: "CO",
        },
      ]

      const transactions = TransactionFactory.createBulkFromData(dataList)

      expect(transactions).toHaveLength(2)
      expect(transactions[0].description).toBe("Transaction 1")
      expect(transactions[1].description).toBe("Transaction 2")
      expect(transactions[0].currency.code).toBe("BRL")
      expect(transactions[1].currency.code).toBe("COP")
    })
  })
})
