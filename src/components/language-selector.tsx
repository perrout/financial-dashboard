import { MOCK_LANGUAGES, type SupportedLanguage } from "@/mocks";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";

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
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(
    MOCK_LANGUAGES[0],
  );

  const handleLanguageChange = (language: SupportedLanguage) => {
    console.log("language", language);
    setSelectedLanguage(language);
  };

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
          }),
        }}
      >
        <span style={{ fontSize: "1.1em" }}>{selectedLanguage.flag}</span>
        {showText && (
          <span className="text-capitalize">{selectedLanguage.nativeName}</span>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        {MOCK_LANGUAGES.map((language: SupportedLanguage) => (
          <Dropdown.Item
            key={language.code}
            active={selectedLanguage.code === language.code}
            onClick={() => handleLanguageChange(language)}
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
