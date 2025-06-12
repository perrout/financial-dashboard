import { useCallback, useState } from "react";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
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
      newErrors.amount = "Valor inválido";
    }
    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    } else if (!selectedCountry.supportsCurrency(formData.currency)) {
      newErrors.currency = "Currency not supported";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const date = new Date(formData.date);
      if (Number.isNaN(date.getTime())) {
        newErrors.date = "Invalid date";
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
        setError("Error creating transaction");
      } finally {
        setLoading(false);
      }
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
    // No mock, sempre retorna sucesso
    return Promise.resolve(true);
  }

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
            <Form.Label htmlFor="description">Description</Form.Label>
            <Form.Control
              id="description"
              type="text"
              placeholder="Description of the transaction"
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
              Amount <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
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
              Currency <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              id="currency"
              value={formData.currency}
              onChange={(e) => handleInputChange("currency", e.target.value)}
              disabled={loading}
              isInvalid={!!errors.currency}
              required
            >
              <option value="">Select the currency</option>
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
              Date <span className="text-danger">*</span>
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
            <Form.Label>País</Form.Label>
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
            Cancel
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
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </Form>
  );
}
