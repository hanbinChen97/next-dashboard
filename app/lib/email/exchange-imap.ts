import imaps from 'imap-simple';
import { EmailService, EmailMessage, EmailFolder, EmailConnectionConfig, EmailFetchOptions } from './types';
import { EmailParser } from './email-parser';

export class ExchangeImapService implements EmailService {
  private connection: any = null;
  private config: EmailConnectionConfig;

  constructor() {
    this.config = {
      host: process.env.EXCHANGE_SERVER || 'mail.rwth-aachen.de',
      port: parseInt(process.env.EXCHANGE_PORT_IMAP || '993'),
      username: process.env.EXCHANGE_USERNAME || '',
      password: process.env.EXCHANGE_KEY || '',
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
      authTimeout: 30000, // 30 seconds timeout
      connTimeout: 30000, // 30 seconds timeout
    };
    
    // Debug: Log configuration (without password)
    console.log('IMAP Config:', {
      host: this.config.host,
      port: this.config.port,
      username: this.config.username,
      tls: this.config.tls,
      authTimeout: this.config.authTimeout,
      connTimeout: this.config.connTimeout,
    });
  }

  /**
   * Connect to Exchange IMAP server
   */
  async connect(): Promise<void> {
    try {
      if (this.connection) {
        return; // Already connected
      }

      console.log('Connecting to Exchange IMAP server...');
      
      // Try different authentication methods for Exchange
      const connectionConfig = {
        ...this.config,
        // Try to force basic authentication
        authMethod: 'PLAIN',
        user: this.config.username, // imap-simple expects 'user' instead of 'username'
      };
      
      console.log('Using auth method:', connectionConfig.authMethod);
      
      // For Exchange servers, sometimes the username needs to be in domain\username format
      if (connectionConfig.user && !connectionConfig.user.includes('\\') && !connectionConfig.user.includes('@')) {
        connectionConfig.user = `rwth-aachen.de\\${connectionConfig.user}`;
        console.log('Modified username to domain format:', connectionConfig.user);
      }
      
      this.connection = await imaps.connect({
        imap: connectionConfig,
      });

      console.log('Successfully connected to Exchange IMAP server');
    } catch (error) {
      console.error('Failed to connect to Exchange IMAP server:', error);
      throw new Error(`IMAP connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Disconnect from Exchange IMAP server
   */
  async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.end();
        this.connection = null;
        console.log('Disconnected from Exchange IMAP server');
      }
    } catch (error) {
      console.error('Error disconnecting from Exchange IMAP server:', error);
    }
  }

  /**
   * List available folders
   */
  async listFolders(): Promise<EmailFolder[]> {
    try {
      await this.ensureConnection();
      const boxes = await this.connection.imap.getBoxes();
      if (!boxes || typeof boxes !== 'object') {
        console.warn('IMAP getBoxes() 返回空或无效:', boxes);
        return [];
      }
      const parseBoxes = (boxObj: any, path = ''): EmailFolder[] => {
        if (!boxObj || typeof boxObj !== 'object') return [];
        return Object.entries(boxObj).flatMap(([name, info]: [string, any]) => {
          const fullPath = path ? path + info.delimiter + name : name;
          const folder: EmailFolder = {
            name,
            path: fullPath,
            delimiter: info.delimiter || '/',
            attributes: info.attribs || [],
            flags: info.flags || [],
          };
          if (info.children) {
            return [folder, ...parseBoxes(info.children, fullPath)];
          }
          return [folder];
        });
      };
      return parseBoxes(boxes);
    } catch (error) {
      console.error('Error listing folders:', error);
      throw new Error(`Failed to list folders: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch emails from specified folder
   */
  async fetchEmails(options: EmailFetchOptions = {}): Promise<EmailMessage[]> {
    try {
      await this.ensureConnection();
      
      const folder = options.folder || 'INBOX';
      const limit = options.limit || 50;
      const offset = options.offset || 0;
      
      console.log(`Fetching emails from ${folder}, limit: ${limit}, offset: ${offset}`);
      
      // Open the folder
      await this.connection.openBox(folder);
      
      // Build search criteria
      const searchCriteria = this.buildSearchCriteria(options);
      
      // Fetch emails
      const messages = await this.connection.search(searchCriteria, {
        bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
        struct: true,
      });
      
      // Sort messages by date (newest first) and apply pagination
      const sortedMessages = messages.sort((a: any, b: any) => {
        // Get dates from messages
        const dateA = this.extractDateFromMessage(a);
        const dateB = this.extractDateFromMessage(b);
        return dateB.getTime() - dateA.getTime(); // Newest first
      });
      
      const paginatedMessages = sortedMessages.slice(offset, offset + limit);
      
      // Parse emails
      const emails: EmailMessage[] = [];
      for (const message of paginatedMessages) {
        try {
          const email = await EmailParser.parseEmail(message);
          emails.push(email);
        } catch (parseError) {
          console.warn('Failed to parse email:', parseError);
          // Continue with other emails
        }
      }
      
      console.log(`Successfully fetched ${emails.length} emails`);
      return emails;
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw new Error(`Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Mark email as read
   */
  async markAsRead(uid: number): Promise<void> {
    try {
      await this.ensureConnection();
      await this.connection.addFlags(uid, '\\Seen');
      console.log(`Marked email ${uid} as read`);
    } catch (error) {
      console.error('Error marking email as read:', error);
      throw new Error(`Failed to mark email as read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Mark email as unread
   */
  async markAsUnread(uid: number): Promise<void> {
    try {
      await this.ensureConnection();
      await this.connection.delFlags(uid, '\\Seen');
      console.log(`Marked email ${uid} as unread`);
    } catch (error) {
      console.error('Error marking email as unread:', error);
      throw new Error(`Failed to mark email as unread: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete email
   */
  async deleteEmail(uid: number): Promise<void> {
    try {
      await this.ensureConnection();
      await this.connection.addFlags(uid, '\\Deleted');
      console.log(`Marked email ${uid} for deletion`);
    } catch (error) {
      console.error('Error deleting email:', error);
      throw new Error(`Failed to delete email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure connection is established
   */
  private async ensureConnection(): Promise<void> {
    if (!this.connection) {
      await this.connect();
    }
  }

  /**
   * Build search criteria based on options
   */
  private buildSearchCriteria(options: EmailFetchOptions): any[] {
    const criteria: any[] = ['ALL'];
    
    if (options.unreadOnly) {
      criteria.push('UNSEEN');
    }
    
    if (options.since) {
      criteria.push(['SINCE', options.since]);
    }
    
    if (options.search) {
      criteria.push(['OR', ['SUBJECT', options.search], ['FROM', options.search], ['TO', options.search]]);
    }
    
    return criteria;
  }

  /**
   * Extract date from message for sorting
   */
  private extractDateFromMessage(message: any): Date {
    try {
      if (message.parts) {
        for (const part of message.parts) {
          if (part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)' && part.body && part.body.date) {
            const dateStr = Array.isArray(part.body.date) ? part.body.date[0] : part.body.date;
            if (dateStr) {
              return new Date(dateStr);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to extract date from message:', error);
    }
    
    // Fallback to current date if extraction fails
    return new Date();
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.connection !== null;
  }

  /**
   * Get server configuration (without sensitive data)
   */
  getServerInfo(): { host: string; port: number; username: string } {
    return {
      host: this.config.host,
      port: this.config.port,
      username: this.config.username,
    };
  }
} 