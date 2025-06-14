import { CountryFactory } from "@/factories/country-factory"
import "@testing-library/jest-dom"
import React, { type ComponentPropsWithoutRef } from "react"
import { vi } from "vitest"

// Mock Zustand stores para testes
export const mockUseTransactionStore = {
  transactions: [],
  loading: false,
  error: null,
  addTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  fetchTransactions: vi.fn(),
  clearError: vi.fn(),
  getTransactionsByCountry: vi.fn(),
  getDailySummary: vi.fn(),
  getCountryBalance: vi.fn(),
  formatCurrency: vi.fn(),
  formatDate: vi.fn(),
}

export const mockUseAppStore = {
  selectedCountry: CountryFactory.createBrazil(),
}

// Mock dos stores Zustand
vi.mock("@/store/transaction-store", () => ({
  useTransactionStore: () => mockUseTransactionStore,
}))
vi.mock("@/store/app-store", () => ({
  useAppStore: () => mockUseAppStore,
}))

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "transaction.description": "Descrição",
        "transaction.amount": "Valor",
        "transaction.currency": "Moeda",
        "transaction.date": "Data",
        "transaction.country": "País",
        "transaction.createTransaction": "Criar Transação",
        "common.cancel": "Cancelar",
        "form.descriptionPlaceholder": "Digite a descrição...",
        "form.amountPlaceholder": "0,00",
        "form.selectCurrency": "Selecione a moeda",
        "form.invalidAmount": "Valor inválido",
        "form.invalidCurrency": "Moeda inválida",
        "form.invalidDate": "Data inválida",
        "common.loading": "Carregando...",
        "common.error": "Erro",
        "common.save": "Salvar",
        "common.saving": "Salvando...",
        "form.save": "Salvar",
        "form.cancel": "Cancelar",
        "form.description": "Descrição",
        "form.amount": "Valor",
        "form.currency": "Moeda",
        "form.date": "Data",
        "form.country": "País",
      }
      return translations[key] || key
    },
    i18n: {
      changeLanguage: vi.fn(),
      language: "pt",
    },
  }),
  initReactI18next: {
    type: "3rdParty",
    init: vi.fn(),
  },
}))

// Mock Chart.js
vi.mock("chart.js", () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  TimeScale: vi.fn(),
}))

// Mock react-chartjs-2
vi.mock("react-chartjs-2", () => ({
  Bar: vi.fn(() => null),
}))

// Mock Bootstrap components para testes
vi.mock("react-bootstrap", () => {
  const filterInvalidProps = (props: Record<string, unknown>) => {
    const { isInvalid, isValid, ...rest } = props
    return rest
  }
  const Form = ({ children, ...props }: ComponentPropsWithoutRef<"form">) => {
    return React.createElement("form", props, children)
  }
  Form.Text = ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
    return React.createElement("div", props, children)
  }
  Form.Group = ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
    return React.createElement("div", props, children)
  }
  Form.Label = ({
    children,
    htmlFor,
    ...props
  }: ComponentPropsWithoutRef<"label">) => {
    return React.createElement("label", { htmlFor, ...props }, children)
  }
  Form.Control = ({ id, ...props }: ComponentPropsWithoutRef<"input">) => {
    return React.createElement("input", filterInvalidProps({ id, ...props }))
  }
  Form.Select = ({
    children,
    id,
    ...props
  }: ComponentPropsWithoutRef<"select">) => {
    return React.createElement(
      "select",
      filterInvalidProps({ id, ...props }),
      children
    )
  }
  Form.Option = ({
    children,
    ...props
  }: ComponentPropsWithoutRef<"option">) => {
    return React.createElement("option", props, children)
  }
  Form.Textarea = ({
    children,
    ...props
  }: ComponentPropsWithoutRef<"textarea">) => {
    return React.createElement("textarea", props, children)
  }
  return {
    Container: ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
      return React.createElement("div", props, children)
    },
    Col: ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
      return React.createElement("div", props, children)
    },
    Card: ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
      return React.createElement("div", props, children)
    },
    Button: ({ children, ...props }: ComponentPropsWithoutRef<"button">) => {
      return React.createElement(
        "button",
        { type: "button", ...props },
        children
      )
    },
    Form,
    Alert: ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
      return React.createElement("div", props, children)
    },
    Modal: ({
      children,
      show,
      ...props
    }: ComponentPropsWithoutRef<"div"> & { show?: boolean }) => {
      return show ? React.createElement("div", props, children) : null
    },
    Table: vi.fn(({ children, ...props }: ComponentPropsWithoutRef<"table">) =>
      React.createElement("table", props, children)
    ),
    Dropdown: ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
      return React.createElement("div", props, children)
    },
    Navbar: ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
      return React.createElement("div", props, children)
    },
    Nav: ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
      return React.createElement("div", props, children)
    },
    Row: ({ children, ...props }: ComponentPropsWithoutRef<"div">) => {
      return React.createElement("div", props, children)
    },
    Spinner: ({ children, ...props }: ComponentPropsWithoutRef<"span">) => {
      return React.createElement("span", props, children)
    },
  }
})

// Mock date-fns
vi.mock("date-fns", () => ({
  format: vi.fn((date, _formatStr) => date.toISOString().split("T")[0]),
  parseISO: vi.fn(dateString => new Date(dateString)),
  isValid: vi.fn(() => true),
}))

// --- Mocks compartilhados para hooks e stores ---
