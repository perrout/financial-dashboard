import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TransactionForm from "../transaction-form"
import { useAppStore } from "@/store/app-store"
import { CountryFactory } from "@/factories/country-factory"
import { useTransactions } from "@/hooks/use-transactions"
import { FormatterService } from "@/services/formatter-service"
import { TransactionService } from "@/services/transaction-service"
import { act } from "react"

// Mock the hooks
vi.mock("@/hooks/use-transactions")
vi.mock("@/store/app-store")

const mockUseTransactions = vi.mocked(useTransactions)
const mockUseAppStore = vi.mocked(useAppStore)

describe("TransactionForm", () => {
  const mockCountry = CountryFactory.createBrazil()
  const mockOnSuccess = vi.fn()
  const mockOnCancel = vi.fn()

  const mockTransactionsHook = {
    createTransaction: vi.fn(),
    updateTransaction: vi.fn(),
    loading: false,
    error: null as string | null,
    clearError: vi.fn(),
    transactions: [],
    dailySummary: null,
    countryBalance: null,
    totalTransactions: 0,
    deleteTransaction: vi.fn(),
    refreshTransactions: vi.fn(),
    formatCurrency: vi.fn(),
    formatDate: vi.fn(),
    formatterService: new FormatterService(),
    transactionService: new TransactionService(),
  }

  const mockAppStoreHook = {
    selectedCountry: mockCountry,
    selectedLanguage: "pt",
    formatterService: new FormatterService(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockTransactionsHook.error = null
    mockTransactionsHook.loading = false
    mockUseTransactions.mockReturnValue(mockTransactionsHook)
    mockUseAppStore.mockReturnValue(mockAppStoreHook)
    mockTransactionsHook.createTransaction.mockResolvedValue(true)
    mockTransactionsHook.updateTransaction.mockResolvedValue(true)
  })

  const defaultProps = {
    onSuccess: mockOnSuccess,
    onCancel: mockOnCancel,
    createTransaction: mockTransactionsHook.createTransaction,
    updateTransaction: mockTransactionsHook.updateTransaction,
    loading: mockTransactionsHook.loading,
    error: mockTransactionsHook.error,
    clearError: mockTransactionsHook.clearError,
  }

  describe("rendering", () => {
    it("should render form fields correctly", () => {
      render(<TransactionForm {...defaultProps} />)

      expect(screen.getByLabelText(/Descrição/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Valor/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Moeda/)).toBeInTheDocument()
      expect(screen.getByLabelText(/Data/)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: "Cancelar" })
      ).toBeInTheDocument()
    })

    it("should render currency options from selected country", () => {
      render(<TransactionForm {...defaultProps} />)

      const currencySelect = screen.getByLabelText(/Moeda/)
      expect(currencySelect).toBeInTheDocument()

      // Check if there are currency options
      expect(screen.getByText("Selecione a moeda")).toBeInTheDocument()
    })

    it("should set today as default date", () => {
      render(<TransactionForm {...defaultProps} />)

      const dateInput = screen.getByLabelText(/Data/)
      const today = new Date().toISOString().split("T")[0]
      expect(dateInput).toHaveValue(today)
    })

    it("should set primary currency as default", () => {
      render(<TransactionForm {...defaultProps} />)

      const currencySelect = screen.getByLabelText(/Moeda/)
      expect(currencySelect).toHaveValue("BRL") // Brazil's primary currency
    })
  })

  describe("form submission", () => {
    it("should submit form with valid data", async () => {
      const user = userEvent.setup()
      render(<TransactionForm {...defaultProps} />)

      await act(async () => {
        await user.type(screen.getByLabelText(/Descrição/), "Test transaction")
        await user.clear(screen.getByLabelText(/Valor/))
        await user.type(screen.getByLabelText(/Valor/), "100.5")
        await user.selectOptions(screen.getByLabelText(/Moeda/), "BRL")
        await user.click(screen.getByRole("button", { name: "Salvar" }))
      })

      await waitFor(() => {
        expect(mockTransactionsHook.createTransaction).toHaveBeenCalledWith({
          description: "Test transaction",
          amount: "100.5",
          currency: "BRL",
          date: expect.any(String),
        })
      })

      expect(mockOnSuccess).toHaveBeenCalled()
    })

    it("should handle form submission failure", async () => {
      mockTransactionsHook.createTransaction.mockResolvedValue(false)

      const user = userEvent.setup()
      render(<TransactionForm {...defaultProps} />)

      await act(async () => {
        await user.clear(screen.getByLabelText(/Valor/))
        await user.type(screen.getByLabelText(/Valor/), "100")
        await user.click(screen.getByRole("button", { name: "Salvar" }))
      })

      await waitFor(() => {
        expect(mockTransactionsHook.createTransaction).toHaveBeenCalled()
      })

      // Should not call onSuccess since submission failed
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })

    it("should prevent submission with empty required fields", async () => {
      const user = userEvent.setup()
      render(<TransactionForm {...defaultProps} />)

      await act(async () => {
        await user.clear(screen.getByLabelText(/Valor/))
        await user.click(screen.getByRole("button", { name: "Salvar" }))
      })

      // Should not call createTransaction due to HTML5 validation
      await waitFor(
        () => {
          expect(mockTransactionsHook.createTransaction).not.toHaveBeenCalled()
        },
        { timeout: 1000 }
      )
    })

    it("should prevent submission with negative amount", async () => {
      const user = userEvent.setup()
      render(<TransactionForm {...defaultProps} />)

      await act(async () => {
        await user.clear(screen.getByLabelText(/Valor/))
        await user.type(screen.getByLabelText(/Valor/), "-100")
        await user.click(screen.getByRole("button", { name: "Salvar" }))
      })

      // Should not call createTransaction due to HTML5 validation
      await waitFor(
        () => {
          expect(mockTransactionsHook.createTransaction).not.toHaveBeenCalled()
        },
        { timeout: 1000 }
      )
    })

    it("should prevent submission with invalid date", async () => {
      const user = userEvent.setup()
      render(<TransactionForm {...defaultProps} />)

      await act(async () => {
        await user.clear(screen.getByLabelText(/Valor/))
        await user.type(screen.getByLabelText(/Valor/), "100")
        await user.selectOptions(screen.getByLabelText(/Moeda/), "BRL")
        await user.clear(screen.getByLabelText(/Data/))
        await user.click(screen.getByRole("button", { name: "Salvar" }))
      })

      // Should not call createTransaction due to HTML5 validation
      await waitFor(
        () => {
          expect(mockTransactionsHook.createTransaction).not.toHaveBeenCalled()
        },
        { timeout: 1000 }
      )
    })

    it("should prevent submission with invalid currency", async () => {
      const user = userEvent.setup()
      render(<TransactionForm {...defaultProps} />)

      await act(async () => {
        await user.clear(screen.getByLabelText(/Valor/))
        await user.type(screen.getByLabelText(/Valor/), "100")
        await user.selectOptions(screen.getByLabelText(/Moeda/), "")
        await user.click(screen.getByRole("button", { name: "Salvar" }))
      })

      // Should not call createTransaction due to required validation
      await waitFor(
        () => {
          expect(mockTransactionsHook.createTransaction).not.toHaveBeenCalled()
        },
        { timeout: 1000 }
      )
    })
  })

  describe("loading state", () => {
    it("should show loading state during submission", () => {
      render(<TransactionForm {...defaultProps} loading={true} />)

      expect(screen.getByText("Salvando...")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /Salvando/ })).toBeDisabled()
    })

    it("should disable form fields during loading", () => {
      render(<TransactionForm {...defaultProps} loading={true} />)

      expect(screen.getByLabelText(/Descrição/)).toBeDisabled()
      expect(screen.getByLabelText(/Valor/)).toBeDisabled()
      expect(screen.getByLabelText(/Moeda/)).toBeDisabled()
      expect(screen.getByLabelText(/Data/)).toBeDisabled()
    })
  })

  describe("error handling", () => {
    it("should display error message", () => {
      defaultProps.error = "Something went wrong"

      render(<TransactionForm {...defaultProps} />)

      expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    })

    it("should clear error when form is modified", async () => {
      defaultProps.error = "Something went wrong"
      const user = userEvent.setup()

      render(<TransactionForm {...defaultProps} />)

      await act(async () => {
        await user.type(screen.getByLabelText(/Valor/), "100.5")
      })

      expect(mockTransactionsHook.clearError).toHaveBeenCalled()
    })
  })

  describe("cancel functionality", () => {
    it("should call onCancel when cancel button is clicked", async () => {
      const user = userEvent.setup()
      render(<TransactionForm {...defaultProps} />)

      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Cancelar" }))
      })

      expect(mockOnCancel).toHaveBeenCalled()
    })

    it("should not render cancel button if onCancel is not provided", () => {
      render(<TransactionForm {...defaultProps} onCancel={undefined} />)

      expect(
        screen.queryByRole("button", { name: "Cancelar" })
      ).not.toBeInTheDocument()
    })
  })

  describe("form validation", () => {
    it("should show validation error for invalid amount", async () => {
      const user = userEvent.setup()
      render(<TransactionForm {...defaultProps} />)

      await act(async () => {
        await user.clear(screen.getByLabelText(/Valor/))
        await user.click(screen.getByRole("button", { name: "Salvar" }))
      })

      // The form validation should prevent submission
      await waitFor(
        () => {
          expect(mockTransactionsHook.createTransaction).not.toHaveBeenCalled()
        },
        { timeout: 1000 }
      )
    })

    it("should validate amount input constraints", () => {
      render(<TransactionForm {...defaultProps} />)

      const amountInput = screen.getByLabelText(/Valor/)

      expect(amountInput).toHaveAttribute("type", "number")
      expect(amountInput).toHaveAttribute("min", "0.01")
      expect(amountInput).toHaveAttribute("step", "0.01")
      expect(amountInput).toHaveAttribute("required")
    })

    it("should validate currency selection", async () => {
      const user = userEvent.setup()
      render(<TransactionForm {...defaultProps} />)

      await act(async () => {
        await user.selectOptions(screen.getByLabelText(/Moeda/), "")
        await user.clear(screen.getByLabelText(/Valor/))
        await user.type(screen.getByLabelText(/Valor/), "100")
        await user.click(screen.getByRole("button", { name: "Salvar" }))
      })

      // Should not call createTransaction due to required validation
      await waitFor(
        () => {
          expect(mockTransactionsHook.createTransaction).not.toHaveBeenCalled()
        },
        { timeout: 1000 }
      )
    })
  })

  describe("country information", () => {
    it("should display selected country information", () => {
      render(<TransactionForm {...defaultProps} />)

      const countryField = screen.getByLabelText(/País/)
      expect(countryField).toHaveValue("🇧🇷 Brasil")
      expect(countryField).toBeDisabled()
    })
  })
})
