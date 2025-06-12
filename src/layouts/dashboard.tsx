import { Container, Nav, Navbar } from "react-bootstrap";
import CountrySelector from "../components/country-selector";
import LanguageSelector from "../components/language-selector";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <Navbar
        bg="white"
        variant="light"
        className="border-bottom mb-4 shadow-sm"
      >
        <Container>
          <Navbar.Brand className="fw-bold text-primary d-flex align-items-center gap-2">
            <i className="bi bi-graph-up" />
            Dashboard
          </Navbar.Brand>
          <Nav className="ms-auto d-flex align-items-center gap-3">
            <CountrySelector />
            <LanguageSelector showText={false} />
          </Nav>
        </Container>
      </Navbar>
      <main>{children}</main>
      <footer className="text-center py-3 mb-2 small text-muted">
        SmartFastPay &copy; {new Date().getFullYear()} • All rights reserved
      </footer>
    </>
  );
}
