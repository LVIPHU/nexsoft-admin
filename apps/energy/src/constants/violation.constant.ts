export const VIOLATION_TOPIC = {
  SPAM_OR_SCAM: 'Spam_Or_Scam',
  HARASSMENT_OR_BULLYING: 'Harassment_Or_Bullying',
  HATE_SPEECH_OR_DISCRIMINATION: 'HateSpeech_Or_Discrimination',
  NUDITY_OR_SEXUAL_CONTENT: 'Nudity_Or_Sexual_Content',
  VIOLENCE_OR_HARMFUL_CONTENT: 'Violence_Or_Harmful_Content',
} as const;

export const VIOLATION_STATUS = {
  PENDING: 'PENDING',
  BYPASS: 'BYPASS',
  BAN: 'BAN',
} as const;

export const VIOLATION_PRIORITY = {
  VERY_HIGH: 'VERY_HIGH',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
} as const;
