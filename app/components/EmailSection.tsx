import { EmailAddress } from '../lib/email/types';

interface Email {
  id: number;
  from: EmailAddress;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

interface EmailSectionProps {
  title: string;
  emails: Email[];
}

export default function EmailSection({ title, emails }: EmailSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">共 {emails.length} 封</span>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              查看全部
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {emails.map((email) => (
            <div key={email.id} className={`p-3 rounded-lg border transition-colors duration-200 ${
              email.unread 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-sm font-medium ${
                      email.unread ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {email.from.name || email.from.address}
                    </span>
                    {email.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <h3 className={`text-sm font-medium truncate ${
                    email.unread ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {email.subject}
                  </h3>
                </div>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {email.time}
                </span>
              </div>
              
              <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                {email.preview}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    回复
                  </button>
                  <button className="text-xs text-gray-600 hover:text-gray-700">
                    转发
                  </button>
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {emails.length === 0 && (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm">暂无重要邮件</p>
          </div>
        )}
      </div>
    </div>
  );
} 