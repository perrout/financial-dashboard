import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type {
  CountryBalance,
  DailyTransactionSummary,
  Transaction,
} from "../models/transaction"
import { TransactionService } from "../services/transaction-service"
import type { Country } from "../models/country"

interface TransactionState {
  // State
  transactions: Transaction[]
  loading: boolean
  error: string | null

  // Services (injected dependencies)
  transactionService: TransactionService

  // Actions
  addTransaction: (
    formData: {
      description: string
      amount: string
      currency: string
      date: string
    },
    country: Country
  ) => Promise<boolean>

  fetchTransactions: (countryCode?: string) => Promise<void>
  removeTransaction: (id: string) => Promise<boolean>
  editTransaction: (
    id: string,
    updates: {
      description?: string
      amount?: string
      currency?: string
      date?: string
    }
  ) => Promise<boolean>
  clearError: () => void

  // Computed selectors
  getTransactionsByCountry: (countryCode: string) => Transaction[]
  getDailySummary: (countryCode: string) => Promise<DailyTransactionSummary[]>
  getCountryBalance: (countryCode: string) => Promise<CountryBalance | null>
}

// Inicializa serviços como singletons
const transactionService = new TransactionService()

export const useTransactionStore = create<TransactionState>()(
  devtools(
    (set, get) => {
      return {
        // Estado inicial
        transactions: [],
        loading: false,
        error: null,

        // Serviços
        transactionService,

        // Actions
        addTransaction: async (formData, country) => {
          set({ loading: true, error: null })
          try {
            const transaction =
              await transactionService.createTransactionFromForm(
                formData,
                country
              )
            set(state => ({
              transactions: [transaction, ...state.transactions],
              loading: false,
            }))
            return true
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create transaction",
              loading: false,
            })
            return false
          }
        },

        fetchTransactions: async countryCode => {
          set({ loading: true, error: null })
          try {
            const transactions = countryCode
              ? await transactionService.getTransactionsByCountry(countryCode)
              : []
            set({
              transactions,
              loading: false,
            })
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch transactions",
              loading: false,
            })
          }
        },

        removeTransaction: async id => {
          set({ loading: true, error: null })
          try {
            const success = await transactionService.deleteTransaction(id)
            if (success) {
              set(state => ({
                transactions: state.transactions.filter(t => t.id !== id),
                loading: false,
              }))
            } else {
              set({ loading: false })
            }
            return success
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to delete transaction",
              loading: false,
            })
            return false
          }
        },

        editTransaction: async (id, updates) => {
          set({ loading: true, error: null })
          try {
            const updated = await transactionService.updateTransaction(id, {
              description: updates.description ?? undefined,
              amount: updates.amount ? Number(updates.amount) : undefined,
              currencyCode: updates.currency ?? undefined,
              date: updates.date ? new Date(updates.date) : undefined,
              countryCode: undefined,
            })
            set(state => ({
              transactions: state.transactions.map(t =>
                t.id === id && updated ? updated : t
              ),
              loading: false,
            }))
            return true
          } catch (error) {
            set({
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to update transaction",
              loading: false,
            })
            return false
          }
        },

        clearError: () => set({ error: null }),

        // Selectors
        getTransactionsByCountry: countryCode => {
          const { transactions } = get()
          return transactions.filter(t => t.isFromCountry(countryCode))
        },

        getDailySummary: async countryCode => {
          const { transactionService } = get()
          return await transactionService.getDailySummaryByCountry(countryCode)
        },

        getCountryBalance: async countryCode => {
          const { transactionService } = get()
          return await transactionService.getCountryBalance(countryCode)
        },
      }
    },
    {
      name: "transaction-store",
    }
  )
)
