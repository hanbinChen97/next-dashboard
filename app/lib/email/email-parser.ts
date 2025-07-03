import { EmailMessage, EmailAddress } from './types';

export class EmailParser {
  /**
   * Parse raw email data into structured EmailMessage
   */
  static async parseEmail(rawEmail: any): Promise<EmailMessage> {
    try {
      console.log('Parsing email with structure:', Object.keys(rawEmail));
      console.log('Raw email parts:', rawEmail.parts);
      
      // imap-simple returns data in a specific format
      // We need to extract the email body from the structure
      let headerData: any = {};
      let emailBody = '';
      
      if (rawEmail.parts) {
        // Multipart email
        for (const part of rawEmail.parts) {
          console.log('Processing part:', part.which, 'Type:', typeof part.body);
          if (part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)') {
            // Headers are returned as an object, not a string
            headerData = typeof part.body === 'object' ? part.body : {};
            console.log('Header data:', headerData);
          } else if (part.which === 'TEXT') {
            emailBody = typeof part.body === 'string' ? part.body : '';
          }
        }
      } else if (rawEmail.body) {
        // Single part email
        emailBody = typeof rawEmail.body === 'string' ? rawEmail.body : '';
      }
      
      console.log('Header data:', headerData);
      console.log('Body type:', typeof emailBody, 'Length:', emailBody.length);
      
      // Parse email data from the header object and body
      let emailData;
      
      try {
        emailData = this.parseEmailFromHeaderObject(headerData, emailBody);
      } catch (parseError) {
        console.error('Error parsing email data:', parseError);
        // Fallback to basic email object
        emailData = {
          subject: '(No Subject)',
          from: { address: 'unknown@example.com' },
          to: [],
          cc: [],
          bcc: [],
          date: new Date(),
          text: emailBody || 'No content available',
          html: '',
        };
      }
      
      return {
        id: `msg_${Date.now()}_${Math.random()}`,
        uid: rawEmail.seqNo || 0,
        subject: emailData.subject || '(No Subject)',
        from: emailData.from,
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        date: emailData.date || new Date(),
        text: emailData.text || undefined,
        html: emailData.html || undefined,
        attachments: [],
        flags: rawEmail.attributes?.flags || [],
        isRead: this.hasFlag(rawEmail.attributes?.flags, '\\Seen'),
        isFlagged: this.hasFlag(rawEmail.attributes?.flags, '\\Flagged'),
        isAnswered: this.hasFlag(rawEmail.attributes?.flags, '\\Answered'),
        isDeleted: this.hasFlag(rawEmail.attributes?.flags, '\\Deleted'),
      };
    } catch (error) {
      console.error('Error parsing email:', error);
      throw new Error(`Failed to parse email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse email from header object and body
   */
  private static parseEmailFromHeaderObject(headerData: any, body: string): {
    subject: string;
    from: EmailAddress;
    to: EmailAddress[];
    cc: EmailAddress[];
    bcc: EmailAddress[];
    date: Date;
    text: string;
    html: string;
  } {
    // Parse email addresses from header arrays
    const parseAddressArray = (addressArray: any[]): EmailAddress[] => {
      if (!addressArray || !Array.isArray(addressArray)) return [];
      
      return addressArray.map(addr => {
        if (typeof addr === 'string') {
          // Simple string email
          return {
            address: addr,
            name: addr.split('@')[0]
          };
        } else if (addr && typeof addr === 'object') {
          // Object with name and address
          return {
            address: addr.address || addr.mailbox + '@' + addr.host || 'unknown@example.com',
            name: addr.name || addr.personal || addr.mailbox || 'Unknown'
          };
        }
        return { address: 'unknown@example.com' };
      });
    };
    
    // Extract text content from body
    let textContent = body;
    const htmlContent = '';
    
    // Try to decode quoted-printable content
    if (textContent.includes('=0A') || textContent.includes('=20')) {
      textContent = this.decodeQuotedPrintable(textContent);
    }
    
    // Remove MIME boundaries and headers from body
    textContent = this.cleanEmailBody(textContent);
    
    // Extract subject from header
    let subject = '(No Subject)';
    if (headerData.subject && Array.isArray(headerData.subject) && headerData.subject.length > 0) {
      subject = headerData.subject[0] || '(No Subject)';
    }
    
    // Extract date from header
    let date = new Date();
    if (headerData.date && Array.isArray(headerData.date) && headerData.date.length > 0) {
      const dateStr = headerData.date[0];
      if (dateStr) {
        try {
          date = new Date(dateStr);
        } catch (e) {
          console.warn('Failed to parse date:', dateStr);
        }
      }
    }
    
    return {
      subject: subject,
      from: parseAddressArray(headerData.from || [])[0] || { address: 'unknown@example.com' },
      to: parseAddressArray(headerData.to || []),
      cc: parseAddressArray(headerData.cc || []),
      bcc: parseAddressArray(headerData.bcc || []),
      date: date,
      text: textContent,
      html: htmlContent,
    };
  }

  /**
   * Decode quoted-printable encoding
   */
  private static decodeQuotedPrintable(input: string): string {
    return input
      .replace(/=0A/g, '\n')
      .replace(/=20/g, ' ')
      .replace(/=0D/g, '\r')
      .replace(/=09/g, '\t')
      .replace(/=([0-9A-F]{2})/g, (match, hex) => {
        try {
          return String.fromCharCode(parseInt(hex, 16));
        } catch (e) {
          return match; // Return original if decoding fails
        }
      });
  }

  /**
   * Clean email body by removing MIME boundaries and headers
   */
  private static cleanEmailBody(body: string): string {
    // Remove MIME boundaries and their content
    body = body.replace(/--[a-zA-Z0-9_]+\r?\nContent-Type: [^\r\n]+\r?\nContent-Transfer-Encoding: [^\r\n]+\r?\n\r?\n[\s\S]*?(?=--[a-zA-Z0-9_]+|$)/g, '');
    
    // Remove remaining MIME boundaries
    body = body.replace(/--[a-zA-Z0-9_]+/g, '');
    
    // Remove Content-Type headers
    body = body.replace(/Content-Type: [^\r\n]+\r?\n/g, '');
    body = body.replace(/Content-Transfer-Encoding: [^\r\n]+\r?\n/g, '');
    body = body.replace(/charset=[^\r\n]+\r?\n/g, '');
    body = body.replace(/meta http-equiv=[^\r\n]+\r?\n/g, '');
    
    // Remove HTML tags if present
    body = body.replace(/<[^>]*>/g, '');
    
    // Clean up whitespace and normalize line breaks
    return body
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();
  }

  /**
   * Check if email has specific flag
   */
  private static hasFlag(flags: string[], flag: string): boolean {
    if (!flags || !Array.isArray(flags)) {
      return false;
    }
    return flags.includes(flag);
  }

  /**
   * Extract text content from email (prefer text over HTML)
   */
  static extractTextContent(email: EmailMessage): string {
    if (email.text) {
      return email.text.trim();
    }
    
    if (email.html) {
      // Simple HTML to text conversion (remove tags)
      return email.html.replace(/<[^>]*>/g, '').trim();
    }
    
    return '';
  }

  /**
   * Get email preview (first 200 characters)
   */
  static getEmailPreview(email: EmailMessage): string {
    const text = this.extractTextContent(email);
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }
} 