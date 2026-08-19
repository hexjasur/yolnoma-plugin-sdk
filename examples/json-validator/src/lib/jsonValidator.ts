/**
 * JSON Validator utility for the JSON Validator plugin.
 *
 * Uses the native JavaScript JSON.parse() and builds a useful
 * error-location layer around it to produce precise diagnostics.
 */

export interface ValidationSuccess {
  readonly valid: true;
  readonly parsed: unknown;
}

export interface ValidationError {
  readonly valid: false;
  readonly message: string;
  readonly line: number;
  readonly column: number;
  /** The approximate source excerpt around the error, if extractable */
  readonly excerpt?: string | undefined;
}

export type ValidationResult = ValidationSuccess | ValidationError;

/**
 * Parse a JSON string with native JSON.parse, then extract error position
 * using a character-level scanner.
 */
export function validateJson(input: string): ValidationResult {
  try {
    const parsed = JSON.parse(input);
    return { valid: true, parsed };
  } catch (err) {
    return buildError(input, err);
  }
}

/**
 * Given the raw input and a JSON parse error, find the line/column
 * of the problematic token.
 */
function buildError(input: string, err: unknown): ValidationError {
  const rawMessage = err instanceof Error ? err.message : String(err);

  // ── Try V8 "Unexpected token X at position N" ─────────────────────────────
  const posMatch = rawMessage.match(/at position (\d+)/);
  if (posMatch?.[1] !== undefined) {
    const pos = parseInt(posMatch[1], 10);
    const { line, column } = positionToLineCol(input, pos);
    return {
      valid: false,
      message: humanizeMessage(rawMessage),
      line,
      column,
      excerpt: extractExcerpt(input, pos),
    };
  }

  // ── Try SpiderMonkey / older Firefox "at line N column N" ─────────────────
  const lineColMatch = rawMessage.match(/line (\d+) column (\d+)/);
  if (lineColMatch?.[1] !== undefined && lineColMatch[2] !== undefined) {
    const line = parseInt(lineColMatch[1], 10);
    const column = parseInt(lineColMatch[2], 10);
    const pos = lineColToPosition(input, line, column);
    return {
      valid: false,
      message: humanizeMessage(rawMessage),
      line,
      column,
      excerpt: pos !== -1 ? extractExcerpt(input, pos) : undefined,
    };
  }

  // ── Heuristic scan for common mistakes ───────────────────────────────────
  const heuristic = runHeuristicScan(input);
  if (heuristic !== null) {
    return {
      valid: false,
      message: heuristic.message,
      line: heuristic.line,
      column: heuristic.column,
      excerpt: heuristic.excerpt,
    };
  }

  // ── Final fallback ────────────────────────────────────────────────────────
  return {
    valid: false,
    message: humanizeMessage(rawMessage),
    line: 1,
    column: 1,
  };
}

/**
 * Convert a flat character offset to 1-based line and column numbers.
 */
function positionToLineCol(
  input: string,
  pos: number
): { line: number; column: number } {
  const clampedPos = Math.min(pos, input.length);
  const before = input.slice(0, clampedPos);
  const lines = before.split("\n");
  const line = lines.length;
  const column = (lines[lines.length - 1]?.length ?? 0) + 1;
  return { line, column };
}

/**
 * Convert 1-based line and column to a flat character offset.
 * Returns -1 if out of range.
 */
function lineColToPosition(
  input: string,
  line: number,
  column: number
): number {
  const lines = input.split("\n");
  let pos = 0;
  for (let i = 0; i < line - 1; i++) {
    pos += (lines[i]?.length ?? 0) + 1; // +1 for \n
  }
  pos += column - 1;
  return pos < input.length ? pos : -1;
}

/**
 * Extract a short excerpt of source around a position to help the user
 * locate the error visually.
 */
function extractExcerpt(input: string, pos: number, radius = 20): string {
  const start = Math.max(0, pos - radius);
  const end = Math.min(input.length, pos + radius);
  let excerpt = input.slice(start, end).replace(/\n/g, "↵");
  if (start > 0) excerpt = "…" + excerpt;
  if (end < input.length) excerpt = excerpt + "…";
  return excerpt;
}

interface HeuristicResult {
  message: string;
  line: number;
  column: number;
  excerpt?: string | undefined;
}

/**
 * Scan for the most common JSON mistakes developers make.
 * Returns diagnostic info or null if nothing specific is found.
 */
function runHeuristicScan(input: string): HeuristicResult | null {
  const lines = input.split("\n");

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex] ?? "";
    const lineNum = lineIndex + 1;

    // Trailing comma before } or ]
    const trailingComma = line.match(/,\s*([}\]])/);
    if (trailingComma) {
      const col = (line.indexOf(",") ?? 0) + 1;
      return {
        message: `Trailing comma before '${trailingComma[1]}'`,
        line: lineNum,
        column: col,
        excerpt: line.trim(),
      };
    }

    // Unquoted object key: starts like word:
    const unquotedKey = line.match(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/);
    if (unquotedKey?.[1] !== undefined) {
      const col = line.indexOf(unquotedKey[1]) + 1;
      return {
        message: `Unquoted key '${unquotedKey[1]}' — JSON keys must be double-quoted strings`,
        line: lineNum,
        column: col,
        excerpt: line.trim(),
      };
    }

    // Single-quoted string
    if (line.includes("'")) {
      const col = line.indexOf("'") + 1;
      return {
        message: `Single-quoted string — JSON only allows double-quoted strings`,
        line: lineNum,
        column: col,
        excerpt: line.trim(),
      };
    }

    // JavaScript comment
    if (/\/\/|\/\*/.test(line)) {
      const col = (line.search(/\/\/|\/\*/) ?? 0) + 1;
      return {
        message: `Comments are not allowed in JSON`,
        line: lineNum,
        column: col,
        excerpt: line.trim(),
      };
    }
  }

  return null;
}

/**
 * Clean up the raw engine error message into a friendlier form.
 */
function humanizeMessage(raw: string): string {
  let msg = raw.replace(/^JSON\.parse:\s*/i, "");
  msg = msg.replace(/\s+at position \d+/i, "").trim();
  return msg.charAt(0).toUpperCase() + msg.slice(1);
}
