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

const URL_PATTERNS = [
  /https?:\/\/[^\s]+/gi,
  /www\.[^\s]+/gi,
  /\b[a-z0-9-]+\.(com|org|net|io|co|edu|gov|me|app|dev|xyz)\b/gi,
];

const PLATFORM_KEYWORDS = [
  "whatsapp", "telegram", "snapchat", "instagram", "tiktok", "discord",
  "messenger", "signal", "viber", "skype", "zoom", "meet me", "facetime",
  "wechat", "line app", "kik", "facebook", "twitter", "linkedin",
];

const OFF_PLATFORM_PHRASES = [
  "call me", "text me", "message me on", "add me on", "find me on",
  "contact me at", "reach me at", "my number is", "my phone is",
  "pay me directly", "pay outside", "venmo", "paypal", "cash app",
  "meet outside", "meet in person", "private lesson", "outside edubridge",
  "off platform", "off the platform", "bypass", "private tutor",
  "my personal", "my private",
];

export function checkPolicy(text: string, context?: string): PolicyCheckResult {
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
            message: "Phone numbers are not allowed for student safety.",
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
        message: "Email addresses are not allowed for student safety.",
      });
      sanitizedText = sanitizedText.replace(match, "[BLOCKED]");
    });
  }

  for (const pattern of URL_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (!match.includes("edubridge")) {
          violations.push({
            type: "external_link",
            match,
            severity: "medium",
            message: "External links are not allowed.",
          });
          sanitizedText = sanitizedText.replace(match, "[BLOCKED]");
        }
      });
    }
  }

  for (const keyword of PLATFORM_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      violations.push({
        type: "platform_mention",
        match: keyword,
        severity: "medium",
        message: `References to external platforms (${keyword}) are not allowed.`,
      });
    }
  }

  for (const phrase of OFF_PLATFORM_PHRASES) {
    if (lowerText.includes(phrase)) {
      violations.push({
        type: "off_platform_request",
        match: phrase,
        severity: "high",
        message: "Off-platform contact requests are not allowed.",
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
    return "For your safety, sharing contact information is not allowed on EduBridge. All communication happens securely within the platform.";
  }
  
  return "This message contains content that isn't allowed on EduBridge. Please revise and try again.";
}

export function maskSensitiveContent(text: string): string {
  let masked = text;
  
  for (const pattern of PHONE_PATTERNS) {
    masked = masked.replace(pattern, "***-***-****");
  }
  
  masked = masked.replace(EMAIL_PATTERN, "****@****.***");
  
  for (const pattern of URL_PATTERNS) {
    masked = masked.replace(pattern, "[link removed]");
  }
  
  return masked;
}
