import { Country } from "@/models/country"
import { CurrencyFactory } from "@/factories/currency-factory"

export interface CountryData {
  code: string
  name: string
  currencyCodes: string[]
  flag: string
}

export type CountryCode = "BR" | "CO" | "US"

export const DEFAULT_COUNTRIES: Record<CountryCode, CountryData> = {
  BR: {
    code: "BR",
    name: "Brasil",
    currencyCodes: ["BRL", "USD"],
    flag: "🇧🇷",
  },
  CO: {
    code: "CO",
    name: "Colômbia",
    currencyCodes: ["COP", "USD"],
    flag: "🇨🇴",
  },
  US: {
    code: "US",
    name: "Estados Unidos",
    currencyCodes: ["USD"],
    flag: "🇺🇸",
  },
} as const

export const CountryFactory = {
  createFromCode(code: CountryCode): Country {
    const countryData = DEFAULT_COUNTRIES[code]
    if (!countryData) throw new Error(`Unsupported country code: ${code}`)
    const currencies = countryData.currencyCodes
      .filter(CurrencyFactory.isSupportedCurrency)
      .map(CurrencyFactory.createFromCode)
    if (currencies.length === 0)
      throw new Error(`No supported currencies found for country: ${code}`)
    return Country.create({
      code: countryData.code,
      name: countryData.name,
      currencies,
      flag: countryData.flag,
    })
  },

  createFromData(data: CountryData): Country {
    const currencies = data.currencyCodes
      .filter(currencyCode => CurrencyFactory.isSupportedCurrency(currencyCode))
      .map(currencyCode => CurrencyFactory.createFromCode(currencyCode))

    return Country.create({
      code: data.code,
      name: data.name,
      currencies,
      flag: data.flag,
    })
  },

  createBrazil(): Country {
    return CountryFactory.createFromCode("BR")
  },

  createColombia(): Country {
    return CountryFactory.createFromCode("CO")
  },

  createUSA(): Country {
    return CountryFactory.createFromCode("US")
  },

  getSupportedCountries(): Country[] {
    return Object.keys(DEFAULT_COUNTRIES).map(code =>
      CountryFactory.createFromCode(code as CountryCode)
    )
  },

  getDefaultCountries(): Country[] {
    return [CountryFactory.createBrazil(), CountryFactory.createColombia()]
  },

  isSupportedCountry(code: string): boolean {
    return code in DEFAULT_COUNTRIES
  },

  getCountryData(code: CountryCode): CountryData | null {
    return DEFAULT_COUNTRIES[code] || null
  },

  findByName(name: string): Country | null {
    const countryEntry = Object.entries(DEFAULT_COUNTRIES).find(
      ([, data]) => data.name.toLowerCase() === name.toLowerCase()
    )

    return countryEntry
      ? CountryFactory.createFromCode(countryEntry[0] as CountryCode)
      : null
  },
}
