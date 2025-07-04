import { ParsedMail } from 'mailparser';
import { EmailMessage, EmailAddress } from './types';

export class EmailParser {
  static parseEmail(parsed: ParsedMail, attrs: any): EmailMessage {
    const from = parsed.from?.value[0] as any;
    const to = (parsed.to as any)?.value || [];

    return {
      id: parsed.messageId || `uid-${attrs.uid}`,
      uid: attrs.uid,
      subject: parsed.subject || '(No Subject)',
      from: {
        name: from?.name,
        address: from?.address || ''
      },
      to: to.map((t: any) => ({
        name: t.name,
        address: t.address || ''
      })),
      date: parsed.date || new Date(),
      text: parsed.text,
      html: typeof parsed.html === 'string' ? parsed.html : undefined,
      attachments: parsed.attachments.map(a => ({
        filename: a.filename || 'untitled',
        contentType: a.contentType,
        size: a.size,
      })),
      flags: attrs.flags,
      isRead: attrs.flags.includes('\\Seen'),
      isFlagged: attrs.flags.includes('\\Flagged'),
      isAnswered: attrs.flags.includes('\\Answered'),
      isDeleted: attrs.flags.includes('\\Deleted'),
    };
  }

  static getEmailPreview(email: EmailMessage): string {
    const text = email.text || '';
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }
}