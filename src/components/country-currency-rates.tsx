import { MOCK_RATES } from "@/mocks"
import { useAppStore } from "@/store/app-store"

export default function CountryCurrencyRates() {
  const { selectedCountry } = useAppStore()
  const rates = MOCK_RATES

  return (
    <>
      {selectedCountry.currencies.map(currency => (
        <div
          key={currency.code}
          className="d-flex justify-content-between align-items-center p-2 bg-light rounded"
        >
          <span className="fw-bold">{currency.code}</span>
          <span className="text-muted">
            1 USD = {rates[currency.code]} {currency.code}
          </span>
        </div>
      ))}
    </>
  )
}
