/**
 * Splits plain text lines by bullet characters (•, -, *) or newlines.
 */
export function parseBulletPoints(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((line) => line.trim().replace(/^[•*\-\d\.]+\s*/, ""))
    .filter((line) => line.length > 0);
}

/**
 * Parses "Q: ... A: ..." FAQ text blocks into structured Question/Answer pairs.
 */
export function parseFaqItems(text: string): { question: string; answer: string }[] {
  if (!text) return [];
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const items: { question: string; answer: string }[] = [];
  let currentQ = "";
  let currentA = "";

  for (const line of lines) {
    if (line.toUpperCase().startsWith("Q:") || line.toUpperCase().startsWith("QUESTION:")) {
      if (currentQ && currentA) {
        items.push({ question: currentQ, answer: currentA });
      }
      currentQ = line.replace(/^(Q:|QUESTION:)\s*/i, "").trim();
      currentA = "";
    } else if (line.toUpperCase().startsWith("A:") || line.toUpperCase().startsWith("ANSWER:")) {
      currentA = line.replace(/^(A:|ANSWER:)\s*/i, "").trim();
    } else if (currentA) {
      currentA += ` ${line}`;
    } else if (currentQ) {
      currentQ += ` ${line}`;
    }
  }
  if (currentQ && currentA) {
    items.push({ question: currentQ, answer: currentA });
  }
  return items;
}

/**
 * Splits standard multi-paragraph text blocks.
 */
export function parseParagraphs(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter((para) => para.length > 0);
}