import React, { useState, useCallback } from "react";
import { validateJson } from "../lib/jsonValidator.js";
import type { ValidationResult } from "../lib/jsonValidator.js";

const PLACEHOLDER = `{
  "name": "Jasur",
  "age": 20,
  "active": true
}`;

export function ValidatorPage(): React.ReactElement {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = useCallback(() => {
    if (input.trim() === "") {
      setResult(null);
      return;
    }
    setResult(validateJson(input));
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handleValidate();
      }
    },
    [handleValidate]
  );

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>JSON Validator</h1>
        <p style={styles.subtitle}>
          Paste JSON below and press Validate (or Ctrl+Enter).
        </p>
      </header>

      <div style={styles.editorRow}>
        <textarea
          style={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          autoComplete="off"
          aria-label="JSON input"
        />
      </div>

      <div style={styles.actions}>
        <button style={styles.btnPrimary} onClick={handleValidate}>
          TEST FROM APPDATA
        </button>
        <button style={styles.btnSecondary} onClick={handleClear}>
          Clear
        </button>
      </div>

      {result !== null && (
        <div
          style={{
            ...styles.resultBox,
            ...(result.valid ? styles.resultValid : styles.resultInvalid),
          }}
          role="status"
          aria-live="polite"
        >
          {result.valid ? (
            <ValidResult />
          ) : (
            <InvalidResult
              message={result.message}
              line={result.line}
              column={result.column}
              excerpt={result.excerpt}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ValidResult(): React.ReactElement {
  return (
    <div style={styles.resultContent}>
      <span style={styles.iconValid}>✓</span>
      <strong style={styles.statusLabel}>Valid JSON</strong>
    </div>
  );
}

interface InvalidResultProps {
  message: string;
  line: number;
  column: number;
  excerpt?: string | undefined;
}

function InvalidResult({
  message,
  line,
  column,
  excerpt,
}: InvalidResultProps): React.ReactElement {
  return (
    <div style={styles.resultContent}>
      <div style={styles.errorHeader}>
        <span style={styles.iconInvalid}>✕</span>
        <strong style={styles.statusLabel}>Invalid JSON</strong>
      </div>
      <p style={styles.errorMessage}>{message}</p>
      <p style={styles.errorLocation}>
        Line {line}, column {column}
      </p>
      {excerpt !== undefined && (
        <code style={styles.errorExcerpt}>{excerpt}</code>
      )}
    </div>
  );
}

// ── Inline styles (no external CSS dependency in Phase 1) ─────────────────────

const styles = {
  container: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: "24px",
    maxWidth: "760px",
    margin: "0 auto",
    color: "#F2EDE6",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "22px",
    fontWeight: 600,
    margin: "0 0 4px 0",
    color: "#F2EDE6",
  },
  subtitle: {
    fontSize: "13px",
    color: "rgba(242,237,230,0.55)",
    margin: 0,
  },
  editorRow: {
    marginBottom: "12px",
  },
  textarea: {
    width: "100%",
    height: "260px",
    background: "#1C1915",
    color: "#F2EDE6",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "13px",
    fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
    lineHeight: "1.6",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
  },
  btnPrimary: {
    background: "#D97757",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "9px 22px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  btnSecondary: {
    background: "rgba(255,255,255,0.06)",
    color: "rgba(242,237,230,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "9px 18px",
    fontSize: "13px",
    cursor: "pointer",
  },
  resultBox: {
    borderRadius: "10px",
    padding: "16px 18px",
    border: "1px solid transparent",
  },
  resultValid: {
    background: "rgba(52, 199, 89, 0.10)",
    borderColor: "rgba(52, 199, 89, 0.25)",
  },
  resultInvalid: {
    background: "rgba(255, 69, 58, 0.10)",
    borderColor: "rgba(255, 69, 58, 0.25)",
  },
  resultContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  errorHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  iconValid: {
    fontSize: "18px",
    color: "#34C759",
  },
  iconInvalid: {
    fontSize: "18px",
    color: "#FF453A",
  },
  statusLabel: {
    fontSize: "14px",
    color: "#F2EDE6",
  },
  errorMessage: {
    fontSize: "13px",
    color: "rgba(242,237,230,0.85)",
    margin: "2px 0 0 0",
  },
  errorLocation: {
    fontSize: "12px",
    color: "rgba(242,237,230,0.45)",
    margin: 0,
    fontFamily: "monospace",
  },
  errorExcerpt: {
    display: "block",
    background: "rgba(0,0,0,0.25)",
    borderRadius: "6px",
    padding: "6px 10px",
    fontSize: "12px",
    color: "#D97757",
    fontFamily: '"JetBrains Mono", monospace',
    whiteSpace: "pre" as const,
    overflowX: "auto" as const,
    marginTop: "4px",
  },
} as const;
