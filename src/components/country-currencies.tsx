import { useAppStore } from "../store/app-store"

export default function CountryCurrencies() {
  const { selectedCountry } = useAppStore()

  return (
    <div className="d-flex flex-column gap-2">
      {selectedCountry.currencies.map(currency => (
        <div
          key={currency.code}
          className="d-flex justify-content-between align-items-center p-2 bg-light rounded"
        >
          <span className="fw-bold">{currency.code}</span>
          <span className="text-muted">{currency.symbol}</span>
        </div>
      ))}
    </div>
  )
}
