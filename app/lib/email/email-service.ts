import { ExchangeImapService } from './exchange-imap';
import { EmailMessage, EmailFolder, EmailFetchOptions } from './types';

export class EmailService {
  private imapService: ExchangeImapService;
  private static instance: EmailService;

  private constructor() {
    this.imapService = new ExchangeImapService();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Get emails with caching and error handling
   */
  async getEmails(options: EmailFetchOptions = {}): Promise<{
    emails: EmailMessage[];
    total: number;
    error?: string;
  }> {
    try {
      console.log('EmailService: Fetching emails with options:', options);
      
      const emails = await this.imapService.fetchEmails(options);
      
      return {
        emails,
        total: emails.length,
      };
    } catch (error) {
      console.error('EmailService: Error fetching emails:', error);
      return {
        emails: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get email folders
   */
  async getFolders(): Promise<{
    folders: EmailFolder[];
    error?: string;
  }> {
    try {
      const folders = await this.imapService.listFolders();
      return { folders };
    } catch (error) {
      console.error('EmailService: Error fetching folders:', error);
      return {
        folders: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Mark email as read
   */
  async markAsRead(uid: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await this.imapService.markAsRead(uid);
      return { success: true };
    } catch (error) {
      console.error('EmailService: Error marking email as read:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Mark email as unread
   */
  async markAsUnread(uid: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await this.imapService.markAsUnread(uid);
      return { success: true };
    } catch (error) {
      console.error('EmailService: Error marking email as unread:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Delete email
   */
  async deleteEmail(uid: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await this.imapService.deleteEmail(uid);
      return { success: true };
    } catch (error) {
      console.error('EmailService: Error deleting email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): {
    connected: boolean;
    serverInfo: { host: string; port: number; username: string };
  } {
    return {
      connected: this.imapService.isConnected(),
      serverInfo: this.imapService.getServerInfo(),
    };
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await this.imapService.connect();
      return { success: true };
    } catch (error) {
      console.error('EmailService: Connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Disconnect from server
   */
  async disconnect(): Promise<void> {
    try {
      await this.imapService.disconnect();
    } catch (error) {
      console.error('EmailService: Error disconnecting:', error);
    }
  }
} 