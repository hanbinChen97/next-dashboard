import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import { EmailService, EmailMessage, EmailFolder, EmailConnectionConfig, EmailFetchOptions } from './types';
import { EmailParser } from './email-parser';

export class ExchangeImapService implements EmailService {
  private imap: Imap;
  private config: EmailConnectionConfig;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.config = {
      host: process.env.EXCHANGE_SERVER || 'mail.rwth-aachen.de',
      port: parseInt(process.env.EXCHANGE_PORT_IMAP || '993'),
      username: process.env.EXCHANGE_USERNAME || '',
      password: process.env.EXCHANGE_KEY || '',
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
    };

    this.imap = new Imap({
        user: this.config.username,
        password: this.config.password,
        host: this.config.host,
        port: this.config.port,
        tls: this.config.tls,
        tlsOptions: this.config.tlsOptions,
        authTimeout: 30000,
        connTimeout: 30000,
    });
  }

  async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        console.log('Successfully connected to Exchange IMAP server');
        resolve();
      });

      this.imap.once('error', (err: Error) => {
        console.error('IMAP connection error:', err);
        this.connectionPromise = null;
        reject(err);
      });

      this.imap.once('end', () => {
        console.log('IMAP connection ended');
        this.connectionPromise = null;
      });

      this.imap.connect();
    });

    return this.connectionPromise;
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
        if (this.imap.state !== 'disconnected') {
            this.imap.end();
        }
        resolve();
    });
  }

  async listFolders(): Promise<EmailFolder[]> {
    await this.connect();
    return new Promise((resolve, reject) => {
      this.imap.getBoxes((err, boxes) => {
        if (err) {
          return reject(err);
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
        resolve(parseBoxes(boxes));
      });
    });
  }

  async fetchEmails(options: EmailFetchOptions = {}): Promise<EmailMessage[]> {
    await this.connect();
    const folder = options.folder || 'INBOX';

    return new Promise((resolve, reject) => {
      this.imap.openBox(folder, true, (err, box) => {
        if (err) {
          return reject(err);
        }

        const searchCriteria = this.buildSearchCriteria(options);
        this.imap.search(searchCriteria, (err, uids) => {
          if (err) {
            return reject(err);
          }

          if (uids.length === 0) {
            return resolve([]);
          }

          const fetchPromises: Promise<EmailMessage>[] = [];

          const f = this.imap.fetch(uids, { bodies: '' });

          f.on('message', (msg, seqno) => {
            let buffer = '';
            let attrsPromiseResolve: (value: any) => void;
            const attrsPromise = new Promise(resolve => { attrsPromiseResolve = resolve; });

            const messagePromise = new Promise<EmailMessage>(async (resolveMessage) => {
              msg.on('body', (stream) => {
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });
              });
              msg.once('end', async () => {
                try {
                  const parsed = await simpleParser(buffer);
                  const attrs = await attrsPromise;
                  resolveMessage(EmailParser.parseEmail(parsed, attrs));
                } catch (parseError) {
                  console.warn('Failed to parse email in fetchEmails:', parseError);
                  // Resolve with a partial email or reject, depending on desired error handling
                  resolveMessage({ id: `error_${seqno}`, uid: seqno, subject: 'Error parsing email', from: { address: '' }, to: [], date: new Date(), attachments: [], flags: [], isRead: false, isFlagged: false, isAnswered: false, isDeleted: false });
                }
              });
              msg.once('attributes', (a) => {
                attrsPromiseResolve(a);
              });
            });
            fetchPromises.push(messagePromise);
          });

          f.once('error', (err) => {
            console.error('Fetch error:', err);
            reject(err);
          });

          f.once('end', async () => {
            try {
              const emails = await Promise.all(fetchPromises);
              // Sort by date (newest first)
              emails.sort((a, b) => b.date.getTime() - a.date.getTime());
              
              // Apply limit and offset
              const paginatedEmails = emails.slice(options.offset || 0, (options.offset || 0) + (options.limit || emails.length));

              resolve(paginatedEmails);
            } catch (allPromisesError) {
              reject(allPromisesError);
            }
          });
        });
      });
    });
  }

  async markAsRead(uid: number): Promise<void> {
    await this.connect();
    return new Promise((resolve, reject) => {
        this.imap.addFlags(uid, '\\Seen', (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
  }

  async markAsUnread(uid: number): Promise<void> {
    await this.connect();
    return new Promise((resolve, reject) => {
        this.imap.delFlags(uid, '\\Seen', (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
  }

  async deleteEmail(uid: number): Promise<void> {
    await this.connect();
    return new Promise((resolve, reject) => {
        this.imap.addFlags(uid, '\\Deleted', (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
  }

  isConnected(): boolean {
    return this.imap.state === 'authenticated';
  }

  getServerInfo(): { host: string; port: number; username: string } {
    return {
      host: this.config.host,
      port: this.config.port,
      username: this.config.username,
    };
  }

  private buildSearchCriteria(options: EmailFetchOptions): any[] {
    const criteria: any[] = ['ALL'];
    
    if (options.unreadOnly) {
      criteria.push('UNSEEN');
    }
    
    if (options.startDate) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      criteria.push(['SINCE', options.startDate || oneMonthAgo]);
    }
    
    if (options.search) {
      criteria.push(['OR', ['SUBJECT', options.search], ['FROM', options.search], ['TO', options.search]]);
    }
    
    return criteria;
  }
}