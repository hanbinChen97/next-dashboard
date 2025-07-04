'use client';

import { useState, useEffect } from 'react';
import { EmailMessage } from '../../lib/email/types';
import { EmailParser } from '../../lib/email/email-parser';
import { markEmailAsRead, markEmailAsUnread, deleteEmail } from '../../lib/email/_action_server';
import { renderEmail } from './EmailView.server';

interface EmailCardProps {
  email: EmailMessage;
  onUpdate?: () => void;
}

export function EmailCard({ email, onUpdate }: EmailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState('');

  useEffect(() => {
    if (isExpanded && email.html && !renderedHtml) {
      renderEmail(email.html).then(setRenderedHtml);
    }
  }, [isExpanded, email.html, renderedHtml]);

  const preview = EmailParser.getEmailPreview(email);
  const formattedDate = new Date(email.date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleMarkAsRead = async () => {
    try {
      const result = await markEmailAsRead(email.uid);
      if (result.success && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to mark email as read:', error);
    }
  };

  const handleMarkAsUnread = async () => {
    try {
      const result = await markEmailAsUnread(email.uid);
      if (result.success && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to mark email as unread:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteEmail(email.uid);
      if (result.success && onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete email:', error);
    }
  };

  return (
    <div className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
      !email.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
    }`}>
      <div 
        className="flex items-start justify-between mb-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 truncate">
              {email.from.name || email.from.address}
            </span>
            {!email.isRead && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                未读
              </span>
            )}
            {email.isFlagged && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                已标记
              </span>
            )}
          </div>
          <h3 className={`font-semibold text-gray-900 mb-1 ${
            !email.isRead ? 'text-blue-900' : ''
          }`}>
            {email.subject}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{preview}</p>
        </div>
        <div className="flex flex-col items-end gap-2 ml-4">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formattedDate}
          </span>
          {email.attachments.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              📎 {email.attachments.length}
            </span>
          )}
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>
      
      {/* Expanded email content */}
      {isExpanded && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">发件人:</span>
                <span className="ml-2 text-gray-900">
                  {email.from.name ? `${email.from.name} <${email.from.address}>` : email.from.address}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">收件人:</span>
                <span className="ml-2 text-gray-900">
                  {email.to.map(addr => addr.name ? `${addr.name} <${addr.address}>` : addr.address).join(', ')}
                </span>
              </div>
              {email.cc && email.cc.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">抄送:</span>
                  <span className="ml-2 text-gray-900">
                    {email.cc.map(addr => addr.name ? `${addr.name} <${addr.address}>` : addr.address).join(', ')}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">日期:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(email.date).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">邮件内容:</h4>
            <div className="bg-white p-3 rounded border text-sm text-gray-900 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {renderedHtml && <iframe srcDoc={renderedHtml} className="w-full h-full" />}
            </div>
          </div>
          
          {email.attachments.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">附件:</h4>
              <div className="space-y-1">
                {email.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <span>📎</span>
                    <span>{attachment.filename}</span>
                    <span className="text-gray-400">({attachment.size} bytes)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={email.isRead ? handleMarkAsUnread : handleMarkAsRead}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {email.isRead ? '标记为未读' : '标记为已读'}
          </button>
          <button
            onClick={handleDelete}
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            删除
          </button>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>收件人: {email.to.length}</span>
          {email.cc && email.cc.length > 0 && (
            <span>抄送: {email.cc.length}</span>
          )}
        </div>
      </div>
    </div>
  );
}