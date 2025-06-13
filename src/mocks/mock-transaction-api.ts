// Mock simples de API externa para transações
import type { Transaction } from "../models/transaction"
import {
  TransactionFactory,
  type CreateTransactionData,
} from "../factories/transaction-factory"

function delay(ms = 400) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Dados iniciais de exemplo
let transactions: Transaction[] = TransactionFactory.createSampleTransactions()
// let transactions: Transaction[] = []

export const MockTransactionApi = {
  async getAll(): Promise<Transaction[]> {
    await delay()
    return [...transactions]
  },
  async getById(id: string): Promise<Transaction | null> {
    await delay()
    return transactions.find(t => t.id === id) || null
  },
  async getByCountry(countryCode: string): Promise<Transaction[]> {
    await delay()
    return transactions.filter(t => t.country.code === countryCode)
  },
  async getByCurrency(currencyCode: string): Promise<Transaction[]> {
    await delay()
    return transactions.filter(t => t.currency.code === currencyCode)
  },
  async create(data: CreateTransactionData): Promise<Transaction> {
    await delay()
    const newTransaction = TransactionFactory.createFromData(data)
    transactions = [newTransaction, ...transactions]
    return newTransaction
  },
  async update(
    id: string,
    updates: Partial<CreateTransactionData>
  ): Promise<Transaction | null> {
    await delay()
    const idx = transactions.findIndex(t => t.id === id)
    if (idx === -1) return null
    // Reconstrói os dados para o TransactionFactory
    const old = transactions[idx]
    const merged: CreateTransactionData = {
      description: updates.description ?? old.description,
      amount: updates.amount ?? old.amount,
      currencyCode: updates.currencyCode ?? old.currency.code,
      date: updates.date ?? old.date,
      countryCode: updates.countryCode ?? old.country.code,
    }
    const updated = TransactionFactory.createFromData(merged)
    // Mantém o mesmo id e createdAt
    const updatedWithMeta = Object.assign(
      Object.create(Object.getPrototypeOf(updated)),
      updated,
      {
        props: {
          ...updated.toData(),
          id: old.id,
          createdAt: old.createdAt,
        },
      }
    )
    transactions[idx] = updatedWithMeta
    return transactions[idx]
  },
  async delete(id: string): Promise<boolean> {
    await delay()
    const prevLen = transactions.length
    transactions = transactions.filter(t => t.id !== id)
    return transactions.length < prevLen
  },
  async clear(): Promise<void> {
    await delay()
    transactions = []
  },
}
