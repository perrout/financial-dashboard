import { describe, it, expect, beforeEach } from "vitest"
import { Transaction } from "@/models/transaction"
import { Currency } from "@/models/currency"
import { Country } from "@/models/country"

describe("Transaction", () => {
  let mockCurrency: Currency
  let mockCountry: Country

  beforeEach(() => {
    mockCurrency = Currency.create({
      code: "BRL",
      name: "Real Brasileiro",
      symbol: "R$",
    })

    mockCountry = Country.create({
      code: "BR",
      name: "Brasil",
      currencies: [mockCurrency],
      flag: "🇧🇷",
    })
  })

  describe("create", () => {
    it("should create a valid transaction", () => {
      const transaction = Transaction.create({
        description: "Test transaction",
        amount: 100.5,
        currency: mockCurrency,
        date: new Date("2025-01-01"),
        country: mockCountry,
      })

      expect(transaction.id).toBeDefined()
      expect(transaction.description).toBe("Test transaction")
      expect(transaction.amount).toBe(100.5)
      expect(transaction.currency).toBe(mockCurrency)
      expect(transaction.country).toBe(mockCountry)
    })

    it("should create transaction without description", () => {
      const transaction = Transaction.create({
        amount: 100,
        currency: mockCurrency,
        date: new Date(),
        country: mockCountry,
      })

      expect(transaction.description).toBeUndefined()
      expect(transaction.amount).toBe(100)
    })

    it("should throw error for negative amount", () => {
      expect(() => {
        Transaction.create({
          description: "Test",
          amount: -100,
          currency: mockCurrency,
          date: new Date(),
          country: mockCountry,
        })
      }).toThrow("Transaction amount must be positive")
    })

    it("should throw error for zero amount", () => {
      expect(() => {
        Transaction.create({
          description: "Test",
          amount: 0,
          currency: mockCurrency,
          date: new Date(),
          country: mockCountry,
        })
      }).toThrow("Transaction amount must be positive")
    })
  })

  describe("business methods", () => {
    let transaction: Transaction

    beforeEach(() => {
      transaction = Transaction.create({
        description: "Test transaction",
        amount: 100.5,
        currency: mockCurrency,
        date: new Date("2025-01-01"),
        country: mockCountry,
      })
    })

    it("should check if transaction is from country", () => {
      expect(transaction.isFromCountry("BR")).toBe(true)
      expect(transaction.isFromCountry("CO")).toBe(false)
    })

    it("should check if transaction has currency", () => {
      expect(transaction.hasCurrency("BRL")).toBe(true)
      expect(transaction.hasCurrency("USD")).toBe(false)
    })

    it("should check if transaction is on specific date", () => {
      const sameDate = new Date("2025-01-01")
      const differentDate = new Date("2025-01-02")

      expect(transaction.isOnDate(sameDate)).toBe(true)
      expect(transaction.isOnDate(differentDate)).toBe(false)
    })
  })

  describe("update methods", () => {
    let transaction: Transaction

    beforeEach(() => {
      transaction = Transaction.create({
        description: "Original description",
        amount: 100,
        currency: mockCurrency,
        date: new Date("2025-01-01"),
        country: mockCountry,
      })
    })

    it("should update description immutably", () => {
      const updated = transaction.updateDescription("New description")

      expect(updated.description).toBe("New description")
      expect(updated.id).toBe(transaction.id)
      expect(transaction.description).toBe("Original description")
    })

    it("should update amount immutably", () => {
      const updated = transaction.updateAmount(200)

      expect(updated.amount).toBe(200)
      expect(updated.id).toBe(transaction.id)
      expect(transaction.amount).toBe(100)
    })

    it("should throw error when updating with invalid amount", () => {
      expect(() => {
        transaction.updateAmount(-100)
      }).toThrow("Transaction amount must be positive")

      expect(() => {
        transaction.updateAmount(0)
      }).toThrow("Transaction amount must be positive")
    })
  })

  describe("serialization", () => {
    it("should convert to data object", () => {
      const transaction = Transaction.create({
        description: "Test",
        amount: 100,
        currency: mockCurrency,
        date: new Date("2025-01-01"),
        country: mockCountry,
      })

      const data = transaction.toData()

      expect(data).toHaveProperty("id")
      expect(data).toHaveProperty("description", "Test")
      expect(data).toHaveProperty("amount", 100)
      expect(data).toHaveProperty("currency", mockCurrency)
      expect(data).toHaveProperty("country", mockCountry)
      expect(data).toHaveProperty("createdAt")
    })

    it("should convert to JSON", () => {
      const transaction = Transaction.create({
        description: "Test",
        amount: 100,
        currency: mockCurrency,
        date: new Date("2025-01-01"),
        country: mockCountry,
      })

      const json = transaction.toJSON()

      expect(json).toHaveProperty("id")
      expect(json).toHaveProperty("description", "Test")
      expect(json).toHaveProperty("amount", 100)
      expect(json).toHaveProperty("currency", mockCurrency)
      expect(json).toHaveProperty("country", mockCountry)
    })
  })

  describe("fromData", () => {
    it("should create transaction from data", () => {
      const originalTransaction = Transaction.create({
        description: "Test",
        amount: 100,
        currency: mockCurrency,
        date: new Date("2025-01-01"),
        country: mockCountry,
      })

      const data = originalTransaction.toData()
      const recreatedTransaction = Transaction.fromData(data)

      expect(recreatedTransaction.id).toBe(originalTransaction.id)
      expect(recreatedTransaction.description).toBe(
        originalTransaction.description
      )
      expect(recreatedTransaction.amount).toBe(originalTransaction.amount)
    })
  })
})
