import { useState, useEffect, useCallback, useMemo } from "react"
import type { Transaction } from "../models/transaction"
import type {
  DailyTransactionSummary,
  CountryBalance,
} from "../services/transaction-service"
import { useTransactionStore } from "../store/transaction-store"
import { useAppStore } from "../store/app-store"

export interface UseTransactionsResult {
  // State
  transactions: Transaction[]
  loading: boolean
  error: string | null

  // Actions
  createTransaction: (formData: {
    description: string
    amount: string
    currency: string
    date: string
  }) => Promise<boolean>

  updateTransaction: (
    id: string,
    updates: {
      description?: string
      amount?: string
    }
  ) => Promise<boolean>

  deleteTransaction: (id: string) => Promise<boolean>
  refreshTransactions: () => Promise<void>
  clearError: () => void

  // Computed data
  dailySummary: DailyTransactionSummary[] | null
  countryBalance: CountryBalance | null
  totalTransactions: number
}

export const useTransactions = (): UseTransactionsResult => {
  const { selectedCountry } = useAppStore()

  // Extract specific functions and state from store to avoid circular dependencies
  const {
    transactions: storeTransactions,
    loading: storeLoading,
    error,
    addTransaction,
    updateTransaction: storeUpdateTransaction,
    deleteTransaction: storeDeleteTransaction,
    fetchTransactions,
    clearError,
    getTransactionsByCountry,
    getDailySummary,
    getCountryBalance,
  } = useTransactionStore()

  const [dailySummary, setDailySummary] = useState<
    DailyTransactionSummary[] | null
  >(null)
  const [countryBalance, setCountryBalance] = useState<CountryBalance | null>(
    null
  )
  const [summaryLoading, setSummaryLoading] = useState(false)

  // Filtered transactions for current country - memoized to prevent recalculation
  const transactions = useMemo(() => {
    // console.log("storeTransactions", storeTransactions)
    return getTransactionsByCountry(selectedCountry.code)
  }, [storeTransactions, selectedCountry.code, getTransactionsByCountry])

  // Load data when country changes
  useEffect(() => {
    fetchTransactions(selectedCountry.code)
  }, [selectedCountry.code, fetchTransactions])

  // Load summary data - memoized callback to prevent recreation on every render
  const loadSummaryData = useCallback(async () => {
    if (transactions.length === 0) {
      setDailySummary([])
      setCountryBalance(null)
      return
    }

    setSummaryLoading(true)
    try {
      const [summary, balance] = await Promise.all([
        getDailySummary(selectedCountry.code),
        getCountryBalance(selectedCountry.code),
      ])

      setDailySummary(summary)
      setCountryBalance(balance)
    } catch (error) {
      console.error("Failed to load summary data:", error)
    } finally {
      setSummaryLoading(false)
    }
  }, [
    selectedCountry.code,
    transactions.length,
    getDailySummary,
    getCountryBalance,
  ])

  // Load summary data when transactions change
  useEffect(() => {
    loadSummaryData()
  }, [loadSummaryData])

  const createTransaction = useCallback(
    async (formData: {
      description: string
      amount: string
      currency: string
      date: string
    }) => {
      const success = await addTransaction(formData, selectedCountry)
      if (success) {
        // Summary will be reloaded automatically via useEffect when transactions change
        // refreshTransactions()
      }
      return success
    },
    [addTransaction, selectedCountry]
  )

  const updateTransaction = useCallback(
    async (
      id: string,
      updates: {
        description?: string
        amount?: string
      }
    ) => {
      const success = await storeUpdateTransaction(id, updates)
      if (success) {
        // Summary will be reloaded automatically via useEffect when transactions change
      }
      return success
    },
    [storeUpdateTransaction]
  )

  const deleteTransaction = useCallback(
    async (id: string) => {
      const success = await storeDeleteTransaction(id)
      if (success) {
        // Summary will be reloaded automatically via useEffect when transactions change
      }
      return success
    },
    [storeDeleteTransaction]
  )

  const refreshTransactions = useCallback(async () => {
    await fetchTransactions(selectedCountry.code)
    // Summary will be reloaded automatically via useEffect when transactions change
  }, [fetchTransactions, selectedCountry.code])

  return {
    // State
    transactions,
    loading: storeLoading || summaryLoading,
    error,

    // Actions
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions,
    clearError,

    // Computed data
    dailySummary,
    countryBalance,
    totalTransactions: transactions.length,
  }
}

export default useTransactions
