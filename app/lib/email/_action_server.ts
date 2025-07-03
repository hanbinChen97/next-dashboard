'use server';

import { EmailService } from './email-service';
import { EmailFetchOptions } from './types';

/**
 * Server action to get emails
 */
export async function getEmails(options: EmailFetchOptions = {}) {
  try {
    const emailService = EmailService.getInstance();
    const result = await emailService.getEmails(options);
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Server action getEmails error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: { emails: [], total: 0 },
    };
  }
}

/**
 * Server action to get email folders
 */
export async function getEmailFolders() {
  try {
    const emailService = EmailService.getInstance();
    const result = await emailService.getFolders();
    
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Server action getEmailFolders error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: { folders: [] },
    };
  }
}

/**
 * Server action to mark email as read
 */
export async function markEmailAsRead(uid: number) {
  try {
    const emailService = EmailService.getInstance();
    const result = await emailService.markAsRead(uid);
    
    return {
      success: result.success,
      error: result.error,
    };
  } catch (error) {
    console.error('Server action markEmailAsRead error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action to mark email as unread
 */
export async function markEmailAsUnread(uid: number) {
  try {
    const emailService = EmailService.getInstance();
    const result = await emailService.markAsUnread(uid);
    
    return {
      success: result.success,
      error: result.error,
    };
  } catch (error) {
    console.error('Server action markEmailAsUnread error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action to delete email
 */
export async function deleteEmail(uid: number) {
  try {
    const emailService = EmailService.getInstance();
    const result = await emailService.deleteEmail(uid);
    
    return {
      success: result.success,
      error: result.error,
    };
  } catch (error) {
    console.error('Server action deleteEmail error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Server action to get connection status
 */
export async function getEmailConnectionStatus() {
  try {
    const emailService = EmailService.getInstance();
    const status = emailService.getConnectionStatus();
    
    return {
      success: true,
      data: status,
    };
  } catch (error) {
    console.error('Server action getEmailConnectionStatus error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: { connected: false, serverInfo: { host: '', port: 0, username: '' } },
    };
  }
}

/**
 * Server action to test email connection
 */
export async function testEmailConnection() {
  try {
    const emailService = EmailService.getInstance();
    const result = await emailService.testConnection();
    
    return {
      success: result.success,
      error: result.error,
    };
  } catch (error) {
    console.error('Server action testEmailConnection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 