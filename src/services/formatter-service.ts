import type { Currency } from "@/models/currency"
import type { Country } from "@/models/country"
import { format, parseISO, isValid } from "date-fns"

export interface CurrencyFormatter {
  format(amount: number, currency: Currency): string
}

export interface DateFormatter {
  format(date: Date): string
  parse(dateString: string): Date
  formatDayMonth(date: Date): string
}

export class BrazilianCurrencyFormatter implements CurrencyFormatter {
  format(amount: number, currency: Currency): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 2,
    }).format(amount)
  }
}

export class ColombianCurrencyFormatter implements CurrencyFormatter {
  format(amount: number, currency: Currency): string {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 0,
    }).format(amount)
  }
}

export class USCurrencyFormatter implements CurrencyFormatter {
  format(amount: number, currency: Currency): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 2,
    }).format(amount)
  }
}

export class BrazilianDateFormatter implements DateFormatter {
  format(date: Date): string {
    return format(date, "dd/MM/yyyy")
  }

  formatDayMonth(date: Date): string {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  parse(dateString: string): Date {
    // Assume ISO format for parsing
    return parseISO(dateString)
  }
}

export class ColombianDateFormatter implements DateFormatter {
  format(date: Date): string {
    return format(date, "dd/MM/yyyy")
  }

  formatDayMonth(date: Date): string {
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  parse(dateString: string): Date {
    return parseISO(dateString)
  }
}

export class USDateFormatter implements DateFormatter {
  format(date: Date): string {
    return format(date, "MM/dd/yyyy")
  }

  formatDayMonth(date: Date): string {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  parse(dateString: string): Date {
    return parseISO(dateString)
  }
}

export class FormatterService {
  private currencyFormatters: Map<string, CurrencyFormatter> = new Map()
  private dateFormatters: Map<string, DateFormatter> = new Map()

  constructor() {
    this.initializeFormatters()
  }

  private initializeFormatters(): void {
    // Currency formatters by country
    this.currencyFormatters.set("BR", new BrazilianCurrencyFormatter())
    this.currencyFormatters.set("CO", new ColombianCurrencyFormatter())
    this.currencyFormatters.set("US", new USCurrencyFormatter())

    // Date formatters by country
    this.dateFormatters.set("BR", new BrazilianDateFormatter())
    this.dateFormatters.set("CO", new ColombianDateFormatter())
    this.dateFormatters.set("US", new USDateFormatter())
  }

  formatCurrency(amount: number, currency: Currency, country: Country): string {
    const formatter = this.currencyFormatters.get(country.code)

    if (!formatter) {
      // Fallback to default formatter
      return new BrazilianCurrencyFormatter().format(amount, currency)
    }

    return formatter.format(amount, currency)
  }

  formatDate(date: Date | string, country: Country): string {
    const formatter = this.dateFormatters.get(country.code)

    const newDate =
      typeof date === "string" ? this.parseDate(date, country) : date

    if (!formatter) {
      // Fallback to default formatter
      return new BrazilianDateFormatter().format(newDate)
    }

    return formatter.format(newDate)
  }

  formatDayMonth(date: Date | string, country: Country): string {
    const formatter = this.dateFormatters.get(country.code)

    const newDate =
      typeof date === "string" ? this.parseDate(date, country) : date

    if (!formatter) {
      // Fallback to default formatter
      return new BrazilianDateFormatter().formatDayMonth(newDate)
    }

    return formatter.formatDayMonth(newDate)
  }

  parseDate(dateString: string, country: Country): Date {
    const formatter = this.dateFormatters.get(country.code)

    if (!formatter) {
      // Fallback to default formatter
      return new BrazilianDateFormatter().parse(dateString)
    }

    return formatter.parse(dateString)
  }

  formatNumber(value: number, country: Country): string {
    switch (country.code) {
      case "BR":
        return value.toLocaleString("pt-BR")
      case "CO":
        return value.toLocaleString("es-CO")
      case "US":
        return value.toLocaleString("en-US")
      default:
        return value.toLocaleString("pt-BR")
    }
  }

  formatPercentage(value: number, country: Country): string {
    const formatter = new Intl.NumberFormat(this.getLocale(country), {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    })

    return formatter.format(value / 100)
  }

  formatDateForInput(date: Date | string): string {
    let d: Date
    if (typeof date === "string") {
      d = parseISO(date)
    } else {
      d = date
    }
    if (!isValid(d)) {
      throw new Error(`Data inválida para input: ${date}`)
    }
    return format(d, "yyyy-MM-dd")
  }

  private getLocale(country: Country): string {
    switch (country.code) {
      case "BR":
        return "pt-BR"
      case "CO":
        return "es-CO"
      case "US":
        return "en-US"
      default:
        return "pt-BR"
    }
  }

  // Static helpers for common formatting
  static formatISODate(date: Date): string {
    return format(date, "yyyy-MM-dd")
  }

  static parseISODate(dateString: string): Date {
    const date = parseISO(dateString)
    if (!isValid(date)) {
      throw new Error(`Invalid date string: ${dateString}`)
    }
    return date
  }

  static isValidDate(date: unknown): boolean {
    return date instanceof Date && isValid(date)
  }

  static isValidAmount(amount: unknown): boolean {
    return typeof amount === "number" && amount > 0 && !Number.isNaN(amount)
  }
}
