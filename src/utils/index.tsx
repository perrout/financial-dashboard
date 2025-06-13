// Função mock para formatar moeda
export function formatCurrency(amount: number, currencyCode: string) {
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  })
}

// Função mock para formatar data
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR")
}

// Função mock para formatar data ISO
export function formatISODate(date: Date) {
  return date.toISOString().split("T")[0]
}

// Função mock para calcular o resumo diário das transações
// export const calculateDailySummary = (
//   transactions: Transaction[]
// ): DailyTransactionSummary[] => {
//   const dailyMap = new Map<
//     string,
//     {
//       date: string
//       totalAmount: number
//       transactionCount: number
//       currency: Currency
//     }
//   >()
//   for (const transaction of transactions) {
//     const dateKey = format(transaction.date, "yyyy-MM-dd")
//     const existing = dailyMap.get(dateKey)

//     if (existing) {
//       existing.totalAmount += transaction.amount
//       existing.transactionCount += 1
//     } else {
//       dailyMap.set(dateKey, {
//         date: dateKey,
//         totalAmount: transaction.amount,
//         transactionCount: 1,
//         currency: transaction.currency,
//       })
//     }
//   }

//   return Array.from(dailyMap.values()).sort(
//     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
//   )
// }

// // Função mock para calcular o saldo total por país e moeda
// export const calculateCountryBalance = (
//   transactions: Transaction[]
// ): CountryBalance[] => {
//   const countryMap = new Map<string, CountryBalance>()
//   for (const transaction of transactions) {
//     const countryKey = transaction.country.code
//     let countryBalance = countryMap.get(countryKey)

//     if (!countryBalance) {
//       countryBalance = {
//         country: transaction.country,
//         balances: [],
//         totalTransactions: 0,
//       }
//       countryMap.set(countryKey, countryBalance)
//     }

//     // Procurar balance para a currency
//     const balance = countryBalance.balances.find(
//       b => b.currency.code === transaction.currency.code
//     )
//     if (balance) {
//       balance.amount += transaction.amount
//       balance.transactionCount += 1
//     } else {
//       countryBalance.balances.push({
//         currency: transaction.currency,
//         amount: transaction.amount,
//         transactionCount: 1,
//       })
//     }
//     countryBalance.totalTransactions += 1
//   }

//   return Array.from(countryMap.values())
// }
