import type { Currency } from "./currency";

export interface Country {
  code: string;
  name: string;
  flag: string;
  currencies: Currency[];
}

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}