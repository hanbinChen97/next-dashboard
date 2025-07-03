'use client';

import { useState, useEffect } from 'react';
import { getEmails, getEmailConnectionStatus } from '../lib/email/_action_server';
import { EmailMessage, EmailFetchOptions } from '../lib/email/types';

interface UseEmailsReturn {
  emails: EmailMessage[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  connectionStatus: {
    connected: boolean;
    serverInfo: { host: string; port: number; username: string };
  } | null;
}

export function useEmails(options: EmailFetchOptions = {}): UseEmailsReturn {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    serverInfo: { host: string; port: number; username: string };
  } | null>(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getEmails(options);
      
      if (result.success) {
        setEmails(result.data.emails);
        setTotal(result.data.total);
      } else {
        setError(result.error || 'Failed to fetch emails');
        setEmails([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setEmails([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionStatus = async () => {
    try {
      const result = await getEmailConnectionStatus();
      if (result.success) {
        setConnectionStatus(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch connection status:', err);
    }
  };

  useEffect(() => {
    fetchEmails();
    fetchConnectionStatus();
  }, [options.folder, options.limit, options.offset, options.unreadOnly]);

  const refetch = async () => {
    await fetchEmails();
    await fetchConnectionStatus();
  };

  return {
    emails,
    loading,
    error,
    total,
    refetch,
    connectionStatus,
  };
} 