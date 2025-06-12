import { useState } from "react";
import { Alert, Button, Spinner, Table } from "react-bootstrap";
import { MOCK_TRANSACTIONS, type Transaction } from "../mocks";
import { deleteTransaction, formatCurrency, formatDate } from "../utils";

interface TransactionListProps {
  onEditTransaction?: (transaction: Transaction) => void;
  className?: string;
}

export default function TransactionList({
  onEditTransaction,
  className = "",
}: TransactionListProps) {
  const [transactions, setTransactions] =
    useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteTransaction = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError("Error deleting transaction.");
    } finally {
      setLoading(false);
    }
  };

  const renderTransaction = (transaction: Transaction) => (
    <tr key={transaction.id}>
      <td>
        <div className="fw-bold">{transaction.description}</div>
        <small className="text-muted">{formatDate(transaction.date)}</small>
      </td>
      <td className="text-end">
        <div className="fw-bold text-success">
          {formatCurrency(transaction.amount, transaction.currency.code)}
        </div>
        <span className="badge bg-secondary fs-6">
          {transaction.currency.code}
        </span>
      </td>
      <td>
        <div className="d-flex gap-1">
          {onEditTransaction && (
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => onEditTransaction(transaction)}
              disabled={loading}
            >
              Edit
            </Button>
          )}
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => handleDeleteTransaction(transaction.id)}
            disabled={loading}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );

  if (loading && transactions.length === 0) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <div className="mt-2">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (transactions.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>No transaction</Alert.Heading>
        <p className="mb-0">
          Add your first transaction to start using the dashboard.
        </p>
      </Alert>
    );
  }

  return (
    <div className={className}>
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>Description</th>
              <th className="text-end">Value</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>{transactions.map(renderTransaction)}</tbody>
        </Table>
      </div>
      {loading && (
        <div className="text-center py-2">
          <Spinner size="sm" animation="border" />
          <span className="ms-2">Loading...</span>
        </div>
      )}
    </div>
  );
}
