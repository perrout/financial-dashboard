export interface CurrencyProps {
  code: string
  name: string
  symbol: string
}

export class Currency {
  private constructor(private props: CurrencyProps) {
    this.validate()
  }

  static create(props: CurrencyProps): Currency {
    return new Currency(props)
  }

  private validate(): void {
    if (!this.props.code || this.props.code.length !== 3) {
      throw new Error("Currency code must be a 3-letter string")
    }

    if (!this.props.name) {
      throw new Error("Currency name is required")
    }

    if (!this.props.symbol) {
      throw new Error("Currency symbol is required")
    }
  }

  get code(): string {
    return this.props.code
  }

  get name(): string {
    return this.props.name
  }

  get symbol(): string {
    return this.props.symbol
  }

  equals(other: Currency): boolean {
    return this.props.code === other.props.code
  }
}
