
export interface ImportantEmail {
  id: string;
  subject: string;
  summary: string;
}

export interface SuggestedNextStep {
  description: string;
  relatedEmailId?: string;
}

export interface SmartMailAssistantResult {
  importantEmails: ImportantEmail[];
  suggestedNextSteps: SuggestedNextStep[];
}
