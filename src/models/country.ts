import type { Currency } from "./currency";

export interface CountryProps {
  code: string;
  name: string;
  flag: string;
  currencies: Currency[];
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export class Country {
  private constructor(private props: CountryProps) {
    this.validate();
  }

  static create(props: CountryProps): Country {
    return new Country(props);
  }

  private validate(): void {
    if (!this.props.code || this.props.code.length !== 2) {
      throw new Error("Country code must be a 2-letter string");
    }

    if (!this.props.name) {
      throw new Error("Country name is required");
    }

    if (!this.props.currencies || this.props.currencies.length === 0) {
      throw new Error("Country must have at least one currency");
    }

    if (!this.props.flag) {
      throw new Error("Country flag is required");
    }
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get flag(): string {
    return this.props.flag;
  }

  get currencies(): Currency[] {
    return [...this.props.currencies];
  }

  get primaryCurrency(): Currency {
    return this.props.currencies[0];
  }

  supportsCurrency(currencyCode: string): boolean {
    return this.props.currencies.some(
      (currency) => currency.code === currencyCode,
    );
  }
}
