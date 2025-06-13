import { Currency } from "../models/currency";

export interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
}

export class CurrencyFactory {
  private static readonly DEFAULT_CURRENCIES: Record<string, CurrencyData> = {
    BRL: {
      code: "BRL",
      name: "Real Brasileiro",
      symbol: "R$",
    },
    COP: {
      code: "COP",
      name: "Peso Colombiano",
      symbol: "$",
    },
    USD: {
      code: "USD",
      name: "Dólar Americano",
      symbol: "$",
    },
    EUR: {
      code: "EUR",
      name: "Euro",
      symbol: "€",
    },
  };

  static createFromCode(code: string): Currency {
    const currencyData = this.DEFAULT_CURRENCIES[code];
    if (!currencyData) {
      throw new Error(`Unsupported currency code: ${code}`);
    }
    return Currency.create(currencyData);
  }

  static createFromData(data: CurrencyData): Currency {
    return Currency.create(data);
  }

  static createBRL(): Currency {
    return this.createFromCode("BRL");
  }

  static createCOP(): Currency {
    return this.createFromCode("COP");
  }

  static createUSD(): Currency {
    return this.createFromCode("USD");
  }

  static createEUR(): Currency {
    return this.createFromCode("EUR");
  }

  static getSupportedCurrencies(): Currency[] {
    return Object.keys(this.DEFAULT_CURRENCIES).map((code) =>
      this.createFromCode(code),
    );
  }

  static isSupportedCurrency(code: string): boolean {
    return code in this.DEFAULT_CURRENCIES;
  }

  static getCurrencyData(code: string): CurrencyData | null {
    return this.DEFAULT_CURRENCIES[code] || null;
  }
}
