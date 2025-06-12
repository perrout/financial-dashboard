import { Country } from '../models/country'
import { CurrencyFactory } from './currency-factory'

export interface CountryData {
    code: string
    name: string
    currencyCodes: string[]
    flag: string
}

export class CountryFactory {
    private static readonly DEFAULT_COUNTRIES: Record<string, CountryData> = {
        BR: {
            code: 'BR',
            name: 'Brasil',
            currencyCodes: ['BRL', 'USD'],
            flag: '🇧🇷'
        },
        CO: {
            code: 'CO',
            name: 'Colômbia',
            currencyCodes: ['COP', 'USD'],
            flag: '🇨🇴'
        },
        US: {
            code: 'US',
            name: 'Estados Unidos',
            currencyCodes: ['USD'],
            flag: '🇺🇸'
        }
    }

    static createFromCode(code: string): Country {
        const countryData = this.DEFAULT_COUNTRIES[code]
        if (!countryData) {
            throw new Error(`Unsupported country code: ${code}`)
        }

        const currencies = countryData.currencyCodes
            .filter(currencyCode => CurrencyFactory.isSupportedCurrency(currencyCode))
            .map(currencyCode => CurrencyFactory.createFromCode(currencyCode))

        if (currencies.length === 0) {
            throw new Error(`No supported currencies found for country: ${code}`)
        }

        return Country.create({
            code: countryData.code,
            name: countryData.name,
            currencies,
            flag: countryData.flag
        })
    }

    static createFromData(data: CountryData): Country {
        const currencies = data.currencyCodes
            .filter(currencyCode => CurrencyFactory.isSupportedCurrency(currencyCode))
            .map(currencyCode => CurrencyFactory.createFromCode(currencyCode))

        return Country.create({
            code: data.code,
            name: data.name,
            currencies,
            flag: data.flag
        })
    }

    static createBrazil(): Country {
        return this.createFromCode('BR')
    }

    static createColombia(): Country {
        return this.createFromCode('CO')
    }

    static createUSA(): Country {
        return this.createFromCode('US')
    }

    static getSupportedCountries(): Country[] {
        return Object.keys(this.DEFAULT_COUNTRIES).map(code =>
            this.createFromCode(code)
        )
    }

    static getDefaultCountries(): Country[] {
        return [
            this.createBrazil(),
            this.createColombia()
        ]
    }

    static isSupportedCountry(code: string): boolean {
        return code in this.DEFAULT_COUNTRIES
    }

    static getCountryData(code: string): CountryData | null {
        return this.DEFAULT_COUNTRIES[code] || null
    }

    static findByName(name: string): Country | null {
        const countryEntry = Object.entries(this.DEFAULT_COUNTRIES)
            .find(([, data]) => data.name.toLowerCase() === name.toLowerCase())

        return countryEntry ? this.createFromCode(countryEntry[0]) : null
    }
} 