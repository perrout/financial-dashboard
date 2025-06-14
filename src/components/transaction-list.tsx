import { Alert, Button, Spinner, Table } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import type { Transaction } from "@/models/transaction"
import { useAppStore } from "@/store/app-store"

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  deleteTransaction: (id: string) => Promise<boolean>
  onEditTransaction?: (transaction: Transaction) => void
  className?: string
}

export default function TransactionList({
  transactions,
  loading,
  error,
  deleteTransaction,
  onEditTransaction,
  className = "",
}: TransactionListProps) {
  const { t } = useTranslation()
  const { formatterService } = useAppStore()

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm(t("transaction.confirmDelete"))) {
      await deleteTransaction(id)
    }
  }

  const renderTransaction = (transaction: Transaction) => (
    <tr key={transaction.id}>
      <td>
        <div className="fw-bold">
          {transaction.description || (
            <span className="text-muted fst-italic">
              {t("transaction.emptyDescription")}
            </span>
          )}
        </div>
        <small className="text-muted">
          {formatterService.formatDate(transaction.date, transaction.country)}
        </small>
      </td>
      <td className="text-end align-middle">
        <div className="fw-bold text-success">
          {formatterService.formatCurrency(
            transaction.amount,
            transaction.currency,
            transaction.country
          )}
        </div>
      </td>
      <td className="align-middle">
        <div className="d-flex gap-1">
          {onEditTransaction && (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => onEditTransaction(transaction)}
              disabled={loading}
            >
              {t("common.edit")}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => handleDeleteTransaction(transaction.id)}
            disabled={loading}
          >
            {t("common.delete")}
          </Button>
        </div>
      </td>
    </tr>
  )

  if (loading) {
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

  if (transactions.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>{t("transaction.noData")}</Alert.Heading>
        <p className="mb-0">{t("transaction.noDataAlert")}</p>
      </Alert>
    )
  }

  return (
    <div className={className}>
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>{t("transaction.description")}</th>
              <th className="text-end">{t("transaction.amount")}</th>
              <th style={{ width: "150px" }}>{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody>{transactions.map(renderTransaction)}</tbody>
        </Table>
      </div>
      {loading && (
        <div className="text-center py-2">
          <Spinner size="sm" animation="border" />
          <span className="ms-2">{t("common.loading")}</span>
        </div>
      )}
    </div>
  )
}
