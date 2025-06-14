import { useState, useEffect, useCallback } from "react"
import type { Transaction } from "@/models/transaction"
import type {
  DailyTransactionSummary,
  CountryBalance,
  TransactionService,
} from "@/services/transaction-service"
import { useTransactionStore } from "@/store/transaction-store"
import { useAppStore } from "@/store/app-store"
import type { FormatterService } from "@/services/formatter-service"

export interface UseTransactionsResult {
  // State
  transactions: Transaction[]
  loading: boolean
  error: string | null

  // Services
  formatterService: FormatterService
  transactionService: TransactionService

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
      currency?: string
      date?: string
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
  const { selectedCountry, formatterService } = useAppStore()

  // Extract specific functions and state from store to avoid circular dependencies
  const {
    transactions,
    loading: storeLoading,
    error,
    addTransaction,
    editTransaction,
    removeTransaction,
    fetchTransactions,
    clearError,
    transactionService,
    getTransactionsByCountry,
  } = useTransactionStore()

  const [dailySummary, setDailySummary] = useState<
    DailyTransactionSummary[] | null
  >(null)
  const [countryBalance, setCountryBalance] = useState<CountryBalance | null>(
    null
  )
  const [summaryLoading, setSummaryLoading] = useState(false)

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
      // const [summary, balance] = await Promise.all([
      //   getDailySummary(selectedCountry.code),
      //   getCountryBalance(selectedCountry.code),
      // ])
      const summary = transactionService.calculateDailySummary(transactions)
      const balance = transactionService.calculateCountryBalance(transactions)

      setDailySummary(summary)
      setCountryBalance(balance)
    } catch (error) {
      console.error("Failed to load summary data:", error)
    } finally {
      setSummaryLoading(false)
    }
  }, [transactions, transactionService])

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
      return await addTransaction(formData, selectedCountry)
    },
    [addTransaction, selectedCountry]
  )

  const updateTransaction = useCallback(
    async (
      id: string,
      updates: {
        description?: string
        amount?: string
        currency?: string
        date?: string
      }
    ) => {
      return await editTransaction(id, updates)
    },
    [editTransaction]
  )

  const deleteTransaction = useCallback(
    async (id: string) => {
      return await removeTransaction(id)
    },
    [removeTransaction]
  )

  const refreshTransactions = useCallback(async () => {
    await fetchTransactions(selectedCountry.code)
  }, [fetchTransactions, selectedCountry.code])

  return {
    // State
    transactions: getTransactionsByCountry(selectedCountry.code),
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

    // Services
    formatterService,
    transactionService,
  }
}

export default useTransactions
