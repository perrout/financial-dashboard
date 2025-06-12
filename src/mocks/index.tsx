import type { Country } from '../models/country';
import type { SupportedLanguage } from '../models/country';
import type { Currency } from '../models/currency';
import type { Transaction } from '../models/transaction';

// Mock do modelo Country
export const MOCK_COUNTRIES: Country[] = [
  {
    code: "BR",
    name: "Brasil",
    flag: "🇧🇷",
    currencies: [{ code: "BRL", name: "Real", symbol: "R$" }],
  },
  {
    code: "CO",
    name: "Colômbia",
    flag: "🇨🇴",
    currencies: [{ code: "COP", name: "Peso", symbol: "$" }],
  },
  {
    code: "US",
    name: "Estados Unidos",
    flag: "🇺🇸",
    currencies: [{ code: "USD", name: "Dólar", symbol: "$" }],
  },
];

// Mock do modelo Currency
export const MOCK_CURRENCIES: Currency[] = [
  { code: "BRL", name: "Real", symbol: "R$" },
  { code: "COP", name: "Peso", symbol: "$" },
  { code: "USD", name: "Dólar", symbol: "$" },
];

// Mock do modelo SupportedLanguage
export const MOCK_LANGUAGES: SupportedLanguage[] = [
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
];

// Mock do modelo Transaction
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    description: 'Compra no supermercado',
    amount: 150.75,
    currency: { code: 'BRL', name: 'Real', symbol: 'R$' },
    date: new Date('2025-06-01T10:00:00Z'),
    country: { code: 'BR', name: 'Brasil', flag: '🇧🇷', currencies: [{ code: 'BRL', name: 'Real', symbol: 'R$' }] },
    createdAt: new Date('2025-06-01T10:00:00Z'),
  },
  {
    id: '2',
    description: 'Assinatura de streaming',
    amount: 39.90,
    currency: { code: 'BRL', name: 'Real', symbol: 'R$' },
    date: new Date('2025-06-02T15:30:00Z'),
    country: { code: 'BR', name: 'Brasil', flag: '🇧🇷', currencies: [{ code: 'BRL', name: 'Real', symbol: 'R$' }] },
    createdAt: new Date('2025-06-02T15:30:00Z'),
  },
  {
    id: '3',
    description: 'Pagamento de serviço',
    amount: 200.00,
    currency: { code: 'USD', name: 'Dólar', symbol: '$' },
    date: new Date('2025-06-03T09:15:00Z'),
    country: { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', currencies: [{ code: 'USD', name: 'Dólar', symbol: '$' }] },
    createdAt: new Date('2025-06-03T09:15:00Z'),
  },
  {
    id: '4',
    description: 'Pagamento de serviço',
    amount: 200.00,
    currency: { code: 'USD', name: 'Dólar', symbol: '$' },
    date: new Date('2025-06-04T10:00:00Z'),
    country: { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', currencies: [{ code: 'USD', name: 'Dólar', symbol: '$' }] },
    createdAt: new Date('2025-06-04T10:00:00Z'),
  },
  {
    id: '5',
    description: 'Pagamento de serviço',
    amount: 200.00,
    currency: { code: 'BRL', name: 'Real', symbol: 'R$' },
    date: new Date('2025-06-04T10:00:00Z'),
    country: { code: 'BR', name: 'Brasil', flag: '🇧🇷', currencies: [{ code: 'BRL', name: 'Real', symbol: 'R$' }] },
    createdAt: new Date('2025-06-04T10:00:00Z'),
  },
];

// País selecionado mock
export const selectedCountry = {
  code: 'BR',
  name: 'Brasil',
  flag: '🇧🇷',
  currencies: [
    { code: 'BRL', name: 'Real', symbol: 'R$' },
    { code: 'USD', name: 'Dólar', symbol: '$' },
  ],
  primaryCurrency: { code: 'BRL', name: 'Real', symbol: 'R$' },
  supportsCurrency: (currencyCode: string) => ['BRL', 'USD'].includes(currencyCode),
};

export const MOCK_LOADING = false;
export const MOCK_ERROR = null;

// Mock de taxas de câmbio
export const MOCK_RATES: Record<string, number> = {
  BRL: 5.5,
  COP: 4000,
  USD: 1,
};