'use client';

import { useState, useEffect } from 'react';
import { useEmails } from '../../hooks/useEmails';
import { EmailList } from '../../components/EmailList';
import { EmailFetchOptions, EmailFolder } from '../../lib/email/types';
import { getEmailFolders } from '../../lib/email/_action_server';
import { getSmartMailAssistantSuggestions } from '../../lib/ai/smart-mail-agent';
import EmailSection from '../../components/EmailSection';
import { ImportantEmail, SuggestedNextStep } from '../../lib/ai/types';

export default function MailsPage() {
  const [emailOptions, setEmailOptions] = useState<EmailFetchOptions>({
    folder: 'INBOX',
    limit: 20,
    unreadOnly: false,
  });
  const [importantEmails, setImportantEmails] = useState<ImportantEmail[]>([]);
  const [suggestedNextSteps, setSuggestedNextSteps] = useState<SuggestedNextStep[]>([]);

  const { emails, loading, error, total, refetch, connectionStatus, folders } = useEmails(emailOptions);

  useEffect(() => {
    if (emails.length > 0) {
      getSmartMailAssistantSuggestions(emails).then(result => {
        setImportantEmails(result.importantEmails);
        setSuggestedNextSteps(result.suggestedNextSteps);
      });
    }
  }, [emails]);

  const handleRefresh = () => {
    refetch();
  };

  const handleUnreadOnlyToggle = () => {
    setEmailOptions(prev => ({
      ...prev,
      unreadOnly: !prev.unreadOnly,
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">邮件中心</h1>
        <p className="text-gray-600 mt-2">查看和管理所有邮件</p>
        
        {/* 连接状态显示 */}
        {connectionStatus && (
          <div className="mt-3 flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              connectionStatus.connected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus.connected ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {connectionStatus.connected ? '已连接' : '未连接'}
            </div>
            <div className="text-sm text-gray-600">
              {connectionStatus.serverInfo.host}:{connectionStatus.serverInfo.port}
            </div>
          </div>
        )}
      </div>
      
      {importantEmails.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">重要邮件</h2>
          <EmailList
            emails={importantEmails.map(ie => emails.find(e => e.id === ie.id)).filter(Boolean) as any}
            loading={loading}
            error={error}
            onUpdate={refetch}
          />
        </div>
      )}

      {suggestedNextSteps.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">建议的下一步工作</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ul className="list-disc pl-5 space-y-2">
              {suggestedNextSteps.map((step, index) => (
                <li key={index} className="text-gray-700">
                  {step.description}
                  {step.relatedEmailId && (
                    <span className="ml-2 text-blue-500 text-sm"> (相关邮件 ID: {step.relatedEmailId})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {emailOptions.folder} {total > 0 && `(${total})`}
              </h2>
              {folders.length > 0 && (
                <select
                  value={emailOptions.folder}
                  onChange={(e) => setEmailOptions(prev => ({ ...prev, folder: e.target.value }))}
                  className="ml-2 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {folders.map((folder) => (
                    <option key={folder.path} value={folder.path}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={emailOptions.unreadOnly}
                onChange={handleUnreadOnlyToggle}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">仅显示未读</span>
            </label>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '加载中...' : '刷新邮件'}
          </button>
        </div>
        
        <EmailList
          emails={emails}
          loading={loading}
          error={error}
          onUpdate={refetch}
        />
      </div>
    </div>
  );
} 