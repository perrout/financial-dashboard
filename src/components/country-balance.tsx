import { useTranslation } from "react-i18next"
import { formatCurrency } from "../utils"
import { Alert } from "react-bootstrap"
import { Spinner } from "react-bootstrap"
import type { CountryBalance as CountryBalanceType } from "../services/transaction-service"

interface CountryBalanceComponentProps {
  countryBalance: CountryBalanceType | null
  loading: boolean
  error: string | null
}

export default function CountryBalance({
  countryBalance,
  loading,
  error,
}: CountryBalanceComponentProps) {
  const { t } = useTranslation()

  if (loading && !countryBalance) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" as="output">
          <span className="visually-hidden">{t("common.loading")}</span>
        </Spinner>
        <div className="mt-2">{t("common.loading")}</div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>{t("common.error")}</Alert.Heading>
        <p>{error}</p>
      </Alert>
    )
  }

  if (!countryBalance) {
    return (
      <div className="text-center">
        <p className="text-muted">{t("transaction.noData")}</p>
      </div>
    )
  }

  return (
    <>
      {countryBalance.balances.map(balance => (
        <div
          key={Math.random()}
          className="d-flex justify-content-between align-items-center mb-2"
        >
          <div className="text-start">
            <div className="fw-bold">{balance.currency.name}</div>
            <small className="text-muted">
              {balance.transactionCount > 1
                ? t("transaction.countPlural", {
                    count: balance.transactionCount,
                  })
                : t("transaction.countSingular", {
                    count: balance.transactionCount,
                  })}
            </small>
          </div>
          <div className="text-end">
            <div className="fw-bold text-success">
              {formatCurrency(balance.amount, balance.currency.code)}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
