import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { type CountryCode, CountryFactory } from "@/factories/country-factory"
import type { Country } from "@/models/country"
import { FormatterService } from "@/services/formatter-service"

const LANGUAGE_OPTIONS = [
  {
    code: "pt" as const,
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇧🇷",
  },
  {
    code: "es" as const,
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
  },
  {
    code: "en" as const,
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
]

export type SupportedLanguage = "pt" | "es" | "en"

export interface AppStore {
  // State
  selectedCountry: Country
  selectedLanguage: SupportedLanguage

  // Services
  formatterService: FormatterService

  // Actions
  setSelectedCountry: (country: Country) => void
  setSelectedCountryByCode: (code: string) => void
  setSelectedLanguage: (language: SupportedLanguage) => void

  // Computed
  getAvailableCountries: () => Country[]
  getSupportedLanguages: () => {
    code: SupportedLanguage
    name: string
    nativeName: string
    flag: string
  }[]
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, _get) => ({
        // Initial state
        selectedCountry: CountryFactory.createBrazil(),
        selectedLanguage: "pt",

        // Services
        formatterService: new FormatterService(),

        // Actions
        setSelectedCountry: country => {
          set({ selectedCountry: country })
        },

        setSelectedCountryByCode: code => {
          try {
            const country = CountryFactory.createFromCode(code as CountryCode)
            set({ selectedCountry: country })
          } catch (error) {
            console.warn(`Failed to set country with code ${code}:`, error)
          }
        },

        setSelectedLanguage: language => {
          set({ selectedLanguage: language })
        },

        // Computed
        getAvailableCountries: () => {
          return CountryFactory.getDefaultCountries()
        },

        getSupportedLanguages: () => {
          return LANGUAGE_OPTIONS
        },
      }),
      {
        name: "app-store",
        partialize: state => ({
          selectedLanguage: state.selectedLanguage,
          selectedCountryCode: state.selectedCountry.code,
        }),
      }
    ),
    {
      name: "app-store",
    }
  )
)
