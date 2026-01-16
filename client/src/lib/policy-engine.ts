export interface PolicyCheckResult {
  blocked: boolean;
  violations: PolicyViolation[];
  sanitizedText: string;
  severity: "none" | "low" | "medium" | "high";
}

export interface PolicyViolation {
  type: string;
  match: string;
  severity: "low" | "medium" | "high";
  message: string;
}

const PHONE_PATTERNS = [
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  /\b\(\d{3}\)\s?\d{3}[-.\s]?\d{4}\b/g,
  /\b\+?\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g,
  /\b\d{10,15}\b/g,
];

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

const PLATFORM_KEYWORDS = [
  "whatsapp", "telegram", "snapchat", "instagram", "tiktok", "discord",
  "messenger", "signal", "viber", "skype", "zoom", "meet me", "facetime",
];

export function checkPolicyClient(text: string): PolicyCheckResult {
  const violations: PolicyViolation[] = [];
  let sanitizedText = text;
  const lowerText = text.toLowerCase();

  for (const pattern of PHONE_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (match.replace(/\D/g, "").length >= 7) {
          violations.push({
            type: "phone_number",
            match,
            severity: "high",
            message: "Phone numbers are not allowed.",
          });
          sanitizedText = sanitizedText.replace(match, "[BLOCKED]");
        }
      });
    }
  }

  const emailMatches = text.match(EMAIL_PATTERN);
  if (emailMatches) {
    emailMatches.forEach(match => {
      violations.push({
        type: "email",
        match,
        severity: "high",
        message: "Email addresses are not allowed.",
      });
      sanitizedText = sanitizedText.replace(match, "[BLOCKED]");
    });
  }

  for (const keyword of PLATFORM_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      violations.push({
        type: "platform_mention",
        match: keyword,
        severity: "medium",
        message: `External platform references are not allowed.`,
      });
    }
  }

  let severity: "none" | "low" | "medium" | "high" = "none";
  if (violations.some(v => v.severity === "high")) severity = "high";
  else if (violations.some(v => v.severity === "medium")) severity = "medium";
  else if (violations.length > 0) severity = "low";

  return {
    blocked: violations.length > 0,
    violations,
    sanitizedText,
    severity,
  };
}

export function getBlockMessage(violations: PolicyViolation[]): string {
  if (violations.length === 0) return "";
  
  const highSeverity = violations.filter(v => v.severity === "high");
  if (highSeverity.length > 0) {
    return "For your safety, sharing contact information is not allowed. All communication happens securely within EduBridge.";
  }
  
  return "This message contains content that isn't allowed. Please revise and try again.";
}
