import { useCallback, useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/app-store";
import { formatISODate } from "../utils";

export interface FormData {
  description: string;
  amount: string;
  currency: string;
  date: string;
}

export interface FormErrors {
  amount?: string;
  currency?: string;
  date?: string;
  general?: string;
}

interface TransactionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export default function TransactionForm({
  onSuccess,
  onCancel,
  className = "",
}: TransactionFormProps) {
  const { t } = useTranslation();
  const { selectedCountry } = useAppStore();

  const [formData, setFormData] = useState<FormData>({
    description: "",
    amount: "",
    currency: selectedCountry.primaryCurrency.code,
    date: formatISODate(new Date()),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = t("form.invalidAmount");
    }
    if (!formData.currency) {
      newErrors.currency = t("form.required");
    } else if (!selectedCountry.supportsCurrency(formData.currency)) {
      newErrors.currency = t("form.invalidCurrency");
    }
    if (!formData.date) {
      newErrors.date = t("form.required");
    } else {
      const date = new Date(formData.date);
      if (Number.isNaN(date.getTime())) {
        newErrors.date = t("form.invalidDate");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (field === "amount" || field === "currency" || field === "date") {
        if (errors[field as keyof FormErrors]) {
          setErrors((prev) => ({
            ...prev,
            [field as keyof FormErrors]: undefined,
          }));
        }
      }
      if (error) setError(null);
    },
    [errors, error],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;
      setLoading(true);
      setError(null);

      setTimeout(async () => {
        try {
          const success = await createTransaction(formData);
          if (success) {
            setFormData({
              description: "",
              amount: "",
              currency: selectedCountry.primaryCurrency.code,
              date: formatISODate(new Date()),
            });
            setErrors({});
            if (onSuccess) onSuccess();
          }
        } catch (err) {
          setErrors({
            general: err instanceof Error ? err.message : t("common.error"),
          });
        } finally {
          setLoading(false);
        }
      }, 3000);
    },
    [formData, validateForm, onSuccess],
  );

  const renderFieldError = (field: keyof FormErrors) => {
    const fieldError = errors[field];
    if (!fieldError) return null;
    return <Form.Text className="text-danger">{fieldError}</Form.Text>;
  };

  const createTransaction = async (formData: FormData): Promise<boolean> => {
    console.log("createTransaction", formData);
    return Promise.resolve(true);
  };

  return (
    <Form onSubmit={handleSubmit} className={className}>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
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
              onChange={(e) => handleInputChange("description", e.target.value)}
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
              onChange={(e) => handleInputChange("amount", e.target.value)}
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
              onChange={(e) => handleInputChange("currency", e.target.value)}
              disabled={loading}
              isInvalid={!!errors.currency}
              required
            >
              <option value="">{t("form.selectCurrency")}</option>
              {selectedCountry.currencies.map((currency) => (
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
              onChange={(e) => handleInputChange("date", e.target.value)}
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
  );
}
