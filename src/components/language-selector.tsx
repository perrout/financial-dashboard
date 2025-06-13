import { useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { type SupportedLanguage, useAppStore } from "../store/app-store";

interface LanguageSelectorProps {
  variant?: "primary" | "outline-primary" | "light" | "link";
  size?: "sm" | "lg";
  showText?: boolean;
  className?: string;
}

export default function LanguageSelector({
  variant = "link",
  size,
  showText = false,
  className = "",
}: LanguageSelectorProps) {
  const { selectedLanguage, setSelectedLanguage, getSupportedLanguages } =
    useAppStore();

  const { i18n } = useTranslation();
  const supportedLanguages = getSupportedLanguages();
  const currentLanguage =
    supportedLanguages.find((lang) => lang.code === selectedLanguage) ||
    supportedLanguages[0];

  const handleLanguageChange = async (languageCode: SupportedLanguage) => {
    setSelectedLanguage(languageCode);
    await i18n.changeLanguage(languageCode);
  };

  useEffect(() => {
    if (i18n.language !== selectedLanguage) {
      handleLanguageChange(selectedLanguage);
    }
  }, [i18n, selectedLanguage]);

  return (
    <Dropdown className={className}>
      <Dropdown.Toggle
        variant={variant}
        size={size}
        id="language-selector"
        className="d-flex align-items-center gap-1 border-0"
        style={{
          boxShadow: "none",
          ...(variant === "link" && {
            background: "transparent",
            border: "none",
            padding: "0.25rem 0.5rem",
            textDecoration: "none",
          }),
        }}
      >
        <span style={{ fontSize: "1.1em" }}>{currentLanguage.flag}</span>
        {showText && (
          <span className="text-capitalize">{currentLanguage.nativeName}</span>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        {supportedLanguages.map((language) => (
          <Dropdown.Item
            key={language.code}
            active={selectedLanguage === language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="d-flex align-items-center gap-2"
          >
            <span style={{ fontSize: "1.1em" }}>{language.flag}</span>
            <div>
              <div className="fw-bold">{language.nativeName}</div>
              <small className="text-muted">{language.name}</small>
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
