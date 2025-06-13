import type { Country } from "./country"
import type { Currency } from "./currency"
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

export interface DailyTransactionSummary {
  date: string
  totalAmount: number
  transactionCount: number
  currency: Currency
}

export interface TransactionProps {
  id: string
  description?: string
  amount: number
  currency: Currency
  date: Date
  country: Country
  createdAt: Date
}

export interface CreateTransactionProps {
  description?: string
  amount: number
  currency: Currency
  date: Date
  country: Country
}

export class Transaction {
  private constructor(private props: TransactionProps) {
    this.validate()
  }

  static create(props: CreateTransactionProps): Transaction {
    return new Transaction({
      ...props,
      id: Transaction.generateId(),
      createdAt: new Date(),
    })
  }

  static fromData(props: TransactionProps): Transaction {
    return new Transaction(props)
  }

  private validate(): void {
    if (this.props.amount <= 0) {
      throw new Error("Transaction amount must be positive")
    }

    if (!this.props.currency) {
      throw new Error("Transaction currency is required")
    }

    if (!this.props.country) {
      throw new Error("Transaction country is required")
    }

    if (!this.props.date) {
      throw new Error("Transaction date is required")
    }
  }

  private static generateId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Getters
  get id(): string {
    return this.props.id
  }

  get description(): string | undefined {
    return this.props.description
  }

  get amount(): number {
    return this.props.amount
  }

  get currency(): Currency {
    return this.props.currency
  }

  get date(): Date {
    return this.props.date
  }

  get country(): Country {
    return this.props.country
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  // Business methods
  isFromCountry(countryCode: string): boolean {
    return this.props.country.code === countryCode
  }

  hasCurrency(currencyCode: string): boolean {
    return this.props.currency.code === currencyCode
  }

  isOnDate(date: Date): boolean {
    return (
      this.props.date.getFullYear() === date.getFullYear() &&
      this.props.date.getMonth() === date.getMonth() &&
      this.props.date.getDate() === date.getDate()
    )
  }

  // Update methods (immutable)
  updateDescription(description: string): Transaction {
    return new Transaction({
      ...this.props,
      description,
    })
  }

  updateAmount(amount: number): Transaction {
    return new Transaction({
      ...this.props,
      amount,
    })
  }

  // Convert to plain object for serialization
  toData(): TransactionProps {
    return { ...this.props }
  }

  // For compatibility with existing code
  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      description: this.description,
      amount: this.amount,
      currency: this.currency,
      date: this.date,
      country: this.country,
      createdAt: this.createdAt,
    }
  }
}
