import { Dropdown } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import type { Country } from "../models/country"
import { useAppStore } from "../store/app-store"

interface CountrySelectorProps {
  variant?: "primary" | "outline-primary" | "light"
  size?: "sm" | "lg"
  className?: string
}

export default function CountrySelector({
  variant = "outline-primary",
  size,
  className = "",
}: CountrySelectorProps) {
  const { t } = useTranslation()
  const { selectedCountry, setSelectedCountry, getAvailableCountries } =
    useAppStore()

  const availableCountries = getAvailableCountries()

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country)
  }

  return (
    <Dropdown className={className}>
      <Dropdown.Toggle
        variant={variant}
        size={size}
        id="country-selector"
        className="d-flex align-items-center gap-2"
      >
        <span style={{ fontSize: "1.2em" }}>{selectedCountry.flag}</span>
        <span>{selectedCountry.name}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>{t("dashboard.selectCountry")}</Dropdown.Header>
        <Dropdown.Divider />

        {availableCountries.map((country: Country) => (
          <Dropdown.Item
            key={country.code}
            active={selectedCountry.code === country.code}
            onClick={() => handleCountryChange(country)}
            className="d-flex align-items-center gap-2"
          >
            <span style={{ fontSize: "1.1em" }}>{country.flag}</span>
            <div>
              <div className="fw-bold">{country.name}</div>
              <small className="text-muted">
                {country.currencies.map(c => c.code).join(", ")}
              </small>
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
