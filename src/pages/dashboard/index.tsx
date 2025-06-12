import { useState } from "react";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import TransactionChart from "../../components/transaction-chart";
import TransactionForm from "../../components/transaction-form";
import TransactionList from "../../components/transaction-list";
import DashboardLayout from "../../layouts/dashboard";
import { MOCK_RATES, MOCK_TRANSACTIONS, selectedCountry } from "../../mocks";
import type { Transaction } from "../../models/transaction";
import { calculateCountryBalance, formatCurrency } from "../../utils";

export default function DashboardPage() {
  // Estado para modal de transação
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const rates = MOCK_RATES;
  const countryBalance = calculateCountryBalance(MOCK_TRANSACTIONS);

  const handleCloseModal = () => {
    console.log("handleCloseModal");
    setShowAddModal(false);
    setEditingTransaction(null);
  };

  const handleAddTransaction = () => {
    console.log("handleAddTransaction");
    setShowAddModal(true);
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    console.log("handleEditTransaction");
    setEditingTransaction(transaction);
    setShowAddModal(true);
  };

  return (
    <DashboardLayout>
      {/* Main Content */}
      <Container className="py-4">
        {/* Page Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h2 className="mb-1 d-flex align-items-center gap-2">
                  {selectedCountry.flag} <span>{selectedCountry.name}</span>
                </h2>
                <p className="text-muted mb-0">
                  Financial Dashboard for {selectedCountry.name}
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddTransaction}
                className="d-flex align-items-center gap-2"
              >
                <i className="bi bi-plus-circle" />
                Add Transaction
              </Button>
            </div>
          </Col>
        </Row>

        {/* Main Dashboard Grid */}
        <Row className="g-4">
          {/* Chart Section */}
          <Col lg={8}>
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-bar-chart-fill text-primary" />
                  Daily Transactions
                </h5>
              </Card.Header>
              <Card.Body>
                <TransactionChart />
              </Card.Body>
            </Card>
          </Col>

          {/* Statistics Section */}
          <Col lg={4}>
            <Row className="g-3">
              <Col xs={12}>
                <Card className="text-center shadow-sm border-primary">
                <Card.Body>
                    <h6 className="text-muted mb-2">Total Balance</h6>
                    {countryBalance.map((countryBalance) => (
                        <div key={countryBalance.country.code}>
                            {countryBalance.balances.map((balance) => (
                                <div key={Math.random()} className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="text-start">
                                        <div className="fw-bold">{balance.currency.name}</div>
                                        <small className="text-muted">{balance.transactionCount} transactions</small>
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold text-success">{formatCurrency(balance.amount, balance.currency.code)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </Card.Body>
                </Card>
              </Col>
              <Col xs={12}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h6 className="text-muted mb-3 d-flex align-items-center gap-2">
                      <i className="bi bi-currency-exchange" />
                      Available Currencies
                    </h6>
                    <div className="d-flex flex-column gap-2">
                      {selectedCountry.currencies.map((currency) => (
                        <div
                          key={currency.code}
                          className="d-flex justify-content-between align-items-center p-2 bg-light rounded"
                        >
                          <span className="fw-bold">{currency.code}</span>
                          <span className="text-muted">{currency.symbol}</span>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h6 className="text-muted mb-3 d-flex align-items-center gap-2">
                      <i className="bi bi-currency-exchange" />
                      Currency Rates
                    </h6>
                    {selectedCountry.currencies.map((currency) => (
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
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Transactions Section */}
        <Row className="mt-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-list-ul text-primary" />
                  Recent Transactions
                </h5>
              </Card.Header>
              <Card.Body>
                <TransactionList onEditTransaction={handleEditTransaction} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Transaction Modal */}
      <Modal show={showAddModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTransaction ? "Edit Transaction" : "Create Transaction"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TransactionForm />
        </Modal.Body>
      </Modal>
    </DashboardLayout>
  );
}
