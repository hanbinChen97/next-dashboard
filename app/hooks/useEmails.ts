'use client';

import { useState, useEffect } from 'react';
import { getEmails, getEmailConnectionStatus, getEmailFolders } from '../lib/email/_action_server';
import { EmailMessage, EmailFetchOptions, EmailFolder } from '../lib/email/types';
import { getCache, setCache, invalidateCache } from '../lib/utils/cache';

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
  folders: EmailFolder[];
}

const EMAIL_CACHE_EXPIRATION_MINUTES = 5; // 邮件缓存有效期 5 分钟
const FOLDER_CACHE_EXPIRATION_MINUTES = 60; // 文件夹缓存有效期 60 分钟
const CONNECTION_STATUS_CACHE_EXPIRATION_MINUTES = 1; // 连接状态缓存有效期 1 分钟

export function useEmails(options: EmailFetchOptions = {}): UseEmailsReturn {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    serverInfo: { host: string; port: number; username: string };
  } | null>(null);
  const [folders, setFolders] = useState<EmailFolder[]>([]);

  const emailCacheKey = `email_cache_${options.folder || 'INBOX'}`;
  const folderCacheKey = 'email_cache_folders';
  const connectionStatusCacheKey = 'email_cache_connection_status';

  const fetchEmails = async () => {
    setError(null);

    // 1. 尝试从缓存加载
    const cachedEmails = getCache(emailCacheKey, EMAIL_CACHE_EXPIRATION_MINUTES);
    if (cachedEmails) {
      setEmails(cachedEmails.emails);
      setTotal(cachedEmails.total);
      setLoading(false); // 立即显示缓存，并将 loading 设置为 false
    } else {
      setLoading(true); // 如果没有缓存，则显示 loading 状态
    }

    // 2. 后台异步请求最新数据
    try {
      const result = await getEmails(options);
      if (result.success) {
        // 3. 比对并更新 UI 和缓存
        if (JSON.stringify(emails) !== JSON.stringify(result.data.emails)) {
          setEmails(result.data.emails);
          setTotal(result.data.total);
        }
        setCache(emailCacheKey, result.data);
      } else {
        setError(result.error || 'Failed to fetch emails');
        setEmails([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      // 如果有缓存，不清除，只显示错误
      if (!cachedEmails) {
        setEmails([]);
        setTotal(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectionStatus = async () => {
    // 尝试从缓存加载
    const cachedStatus = getCache(connectionStatusCacheKey, CONNECTION_STATUS_CACHE_EXPIRATION_MINUTES);
    if (cachedStatus) {
      setConnectionStatus(cachedStatus);
    }

    // 后台异步请求最新数据
    try {
      const result = await getEmailConnectionStatus();
      if (result.success) {
        if (JSON.stringify(connectionStatus) !== JSON.stringify(result.data)) {
          setConnectionStatus(result.data);
        }
        setCache(connectionStatusCacheKey, result.data);
      }
    } catch (err) {
      console.error('Failed to fetch connection status:', err);
    }
  };

  const fetchFolders = async () => {
    // 尝试从缓存加载
    const cachedFolders = getCache(folderCacheKey, FOLDER_CACHE_EXPIRATION_MINUTES);
    if (cachedFolders) {
      setFolders(cachedFolders.folders);
    }

    // 后台异步请求最新数据
    try {
      const result = await getEmailFolders();
      if (result.success && result.data.folders) {
        if (JSON.stringify(folders) !== JSON.stringify(result.data.folders)) {
          setFolders(result.data.folders);
        }
        setCache(folderCacheKey, result.data);
      }
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  useEffect(() => {
    fetchEmails();
    fetchConnectionStatus();
    fetchFolders();
  }, [options.folder, options.limit, options.offset, options.unreadOnly]);

  const refetch = async () => {
    invalidateCache(emailCacheKey);
    invalidateCache(connectionStatusCacheKey);
    invalidateCache(folderCacheKey);
    await fetchEmails();
    await fetchConnectionStatus();
    await fetchFolders();
  };

  return {
    emails,
    loading,
    error,
    total,
    refetch,
    connectionStatus,
    folders,
  };
}