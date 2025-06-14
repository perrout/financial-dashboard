import { describe, it, expect, beforeEach, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useTransactions } from "@/hooks/use-transactions"
import { CountryFactory } from "@/factories/country-factory"
import { TransactionFactory } from "@/factories/transaction-factory"
import { mockUseTransactionStore, mockUseAppStore } from "@/tests/setup"

describe("useTransactions", () => {
  const mockCountry = CountryFactory.createBrazil()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseTransactionStore.error = null
    mockUseTransactionStore.loading = false
    mockUseAppStore.selectedCountry = mockCountry

    // Setup default mock implementations
    mockUseTransactionStore.getTransactionsByCountry.mockReturnValue([])
    mockUseTransactionStore.getDailySummary.mockResolvedValue([])
    mockUseTransactionStore.getCountryBalance.mockResolvedValue(null)
    mockUseTransactionStore.formatCurrency.mockReturnValue("R$ 100,00")
    mockUseTransactionStore.formatDate.mockReturnValue("01/01/2023")
  })

  describe("initialization", () => {
    it("should initialize with correct default values", async () => {
      const { result } = renderHook(() => useTransactions())

      expect(result.current.transactions).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.countryBalance).toBe(null)
      expect(result.current.totalTransactions).toBe(0)

      // Wait for the effect to set dailySummary to [] for empty transactions
      await waitFor(() => {
        expect(result.current.dailySummary).toEqual([])
      })
    })

    it("should fetch transactions on mount", async () => {
      renderHook(() => useTransactions())

      expect(mockUseTransactionStore.fetchTransactions).toHaveBeenCalledWith(
        "BR"
      )
    })
  })

  describe("transactions filtering", () => {
    it("should filter transactions by selected country", () => {
      const mockTransactions = [
        TransactionFactory.createFromData({
          description: "Transaction 1",
          amount: 100,
          currencyCode: "BRL",
          date: new Date(),
          countryCode: "BR",
        }),
        TransactionFactory.createFromData({
          description: "Transaction 2",
          amount: 100,
          currencyCode: "COP",
          date: new Date(),
          countryCode: "CO",
        }),
      ]
      mockUseTransactionStore.getTransactionsByCountry.mockReturnValue(
        mockTransactions.filter(t => t.country.code === "BR")
      )

      const { result } = renderHook(() => useTransactions())

      expect(
        mockUseTransactionStore.getTransactionsByCountry
      ).toHaveBeenCalledWith("BR")
      expect(result.current.transactions).toHaveLength(1)
    })
  })
})
