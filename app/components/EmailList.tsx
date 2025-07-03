'use client';

import { EmailCard } from './EmailCard';
import { EmailMessage } from '../lib/email/types';

interface EmailListProps {
  emails: EmailMessage[];
  loading: boolean;
  error: string | null;
  onUpdate?: () => void;
}

export function EmailList({ emails, loading, error, onUpdate }: EmailListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/3"></div>
                <div className="h-5 bg-gray-200 rounded mb-2 w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="ml-4">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 font-medium mb-2">加载邮件时出错</div>
        <div className="text-red-500 text-sm">{error}</div>
        <button
          onClick={onUpdate}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-2">📧</div>
        <div className="text-gray-600 font-medium mb-1">暂无邮件</div>
        <div className="text-gray-500 text-sm">收件箱中没有找到邮件</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <EmailCard
          key={email.id}
          email={email}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
} 