import { useCallback, useState, useEffect } from "react"
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useAppStore } from "../store/app-store"
import { formatISODate } from "../utils"
import type { Transaction } from "../models/transaction"

export interface FormData {
  description: string
  amount: string
  currency: string
  date: string
}

export interface FormErrors {
  amount?: string
  currency?: string
  date?: string
  general?: string
}

interface TransactionFormProps {
  transaction?: Transaction | null
  createTransaction: (formData: FormData) => Promise<boolean>
  updateTransaction: (
    id: string,
    updates: Partial<FormData>
  ) => Promise<boolean>
  loading: boolean
  error: string | null
  clearError: () => void
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export default function TransactionForm({
  onSuccess,
  onCancel,
  className = "",
  transaction = null,
  createTransaction,
  updateTransaction,
  loading,
  error,
  clearError,
}: TransactionFormProps) {
  const { t } = useTranslation()
  const { selectedCountry } = useAppStore()

  const [formData, setFormData] = useState<FormData>({
    description: "",
    amount: "",
    currency: selectedCountry.primaryCurrency.code,
    date: formatISODate(new Date()),
  })
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description ?? "",
        amount: String(transaction.amount),
        currency:
          typeof transaction.currency === "string"
            ? transaction.currency
            : transaction.currency.code,
        date: transaction.date
          ? formatISODate(
              typeof transaction.date === "string"
                ? new Date(transaction.date)
                : transaction.date
            )
          : formatISODate(new Date()),
      })
    } else {
      setFormData({
        description: "",
        amount: "",
        currency: selectedCountry.primaryCurrency.code,
        date: formatISODate(new Date()),
      })
    }
    setErrors({})
  }, [transaction, selectedCountry.primaryCurrency.code])

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = t("form.invalidAmount")
    }
    if (!formData.currency) {
      newErrors.currency = t("form.required")
    } else if (!selectedCountry.supportsCurrency(formData.currency)) {
      newErrors.currency = t("form.invalidCurrency")
    }
    if (!formData.date) {
      newErrors.date = t("form.required")
    } else {
      const date = new Date(formData.date)
      if (Number.isNaN(date.getTime())) {
        newErrors.date = t("form.invalidDate")
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, selectedCountry.supportsCurrency, t])

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }))

      // Clear field-specific error
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: undefined }))
      }

      // Clear general error
      if (error) {
        clearError()
      }
    },
    [errors, error, clearError]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) {
        return
      }

      try {
        let success = false
        if (transaction) {
          success = await updateTransaction(transaction.id, {
            description: formData.description,
            amount: formData.amount,
            currency: formData.currency,
            date: `${formData.date}T00:00:00Z`,
          })
        } else {
          success = await createTransaction({
            ...formData,
            currency: formData.currency,
            date: `${formData.date}T00:00:00Z`,
          })
        }

        if (success) {
          setFormData({
            description: "",
            amount: "",
            currency: selectedCountry.primaryCurrency.code,
            date: formatISODate(new Date()),
          })
          setErrors({})

          if (onSuccess) {
            onSuccess()
          }
        }
      } catch (err) {
        setErrors({
          general: err instanceof Error ? err.message : t("common.error"),
        })
      }
    },
    [
      formData,
      validateForm,
      createTransaction,
      updateTransaction,
      transaction,
      selectedCountry,
      onSuccess,
      t,
    ]
  )

  const renderFieldError = (field: keyof FormErrors) => {
    const fieldError = errors[field]
    if (!fieldError) return null

    return <Form.Text className="text-danger">{fieldError}</Form.Text>
  }

  const renderGeneralError = () => {
    const allErrors = []

    if (errors.general) {
      allErrors.push(errors.general)
    }

    if (error) {
      allErrors.push(error)
    }

    if (allErrors.length === 0) return null

    return (
      <Alert variant="danger" className="mb-3">
        {allErrors.map(err => (
          <div key={err}>{err}</div>
        ))}
      </Alert>
    )
  }

  return (
    <Form onSubmit={handleSubmit} className={className}>
      {renderGeneralError()}

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="description">
              {t("transaction.description")}
            </Form.Label>
            <Form.Control
              id="description"
              type="text"
              placeholder={t("form.descriptionPlaceholder")}
              value={formData.description}
              onChange={e => handleInputChange("description", e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="amount">
              {t("transaction.amount")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder={t("form.amountPlaceholder")}
              value={formData.amount}
              onChange={e => handleInputChange("amount", e.target.value)}
              disabled={loading}
              isInvalid={!!errors.amount}
              required
            />
            {renderFieldError("amount")}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="currency">
              {t("transaction.currency")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              id="currency"
              value={formData.currency}
              onChange={e => handleInputChange("currency", e.target.value)}
              disabled={loading}
              isInvalid={!!errors.currency}
              required
            >
              <option value="">{t("form.selectCurrency")}</option>
              {selectedCountry.currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.symbol} {currency.name}
                </option>
              ))}
            </Form.Select>
            {renderFieldError("currency")}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="date">
              {t("transaction.date")} <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              id="date"
              type="date"
              value={formData.date}
              onChange={e => handleInputChange("date", e.target.value)}
              disabled={loading}
              isInvalid={!!errors.date}
              required
            />
            {renderFieldError("date")}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t("transaction.country")}</Form.Label>
            <Form.Control
              type="text"
              value={`${selectedCountry.flag} ${selectedCountry.name}`}
              disabled
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-end gap-2">
        {onCancel && (
          <Button
            variant="outline-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {t("common.cancel")}
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              {t("common.saving")}
            </>
          ) : (
            t("common.save")
          )}
        </Button>
      </div>
    </Form>
  )
}
