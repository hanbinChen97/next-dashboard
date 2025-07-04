'use client';

import { useState, useEffect } from 'react';
import TaskCard from '../../components/TaskCard';
import EmailSection from '../../components/EmailSection';
import { getSmartMailAssistantSuggestions } from '../../lib/ai/smart-mail-agent';
import { ImportantEmail, SuggestedNextStep } from '../../lib/ai/types';
import { EmailMessage } from '../../lib/email/types';

// 定义任务类型
interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  tags: string[];
}

const mockEmails: EmailMessage[] = [
  {
    id: 'email-1',
    uid: 1,
    subject: 'Urgent: Action Required on Project X',
    from: { name: 'Alice', address: 'alice@example.com' },
    to: [],
    date: new Date(),
    text: 'Please review the attached document and provide your feedback by end of day.',
    attachments: [],
    flags: [],
    isRead: false,
    isFlagged: false,
    isAnswered: false,
    isDeleted: false,
  },
  {
    id: 'email-2',
    uid: 2,
    subject: 'Meeting Reminder: Project Sync',
    from: { name: 'Bob', address: 'bob@example.com' },
    to: [],
    date: new Date(),
    text: 'Just a reminder about our project sync meeting tomorrow at 10 AM.',
    attachments: [],
    flags: [],
    isRead: true,
    isFlagged: false,
    isAnswered: false,
    isDeleted: false,
  },
  {
    id: 'email-3',
    uid: 3,
    subject: 'Weekly Report',
    from: { name: 'Charlie', address: 'charlie@example.com' },
    to: [],
    date: new Date(),
    text: 'Here is the weekly report for your review.',
    attachments: [],
    flags: [],
    isRead: false,
    isFlagged: false,
    isAnswered: false,
    isDeleted: false,
  },
];

export default function HomePage() {
  // 模拟任务数据
  const tasks: Task[] = [
    {
      id: 1,
      title: "完成项目A的API设计文档",
      description: "需要设计用户认证和权限管理的API接口",
      priority: "high",
      dueDate: "2024-01-15",
      status: "pending",
      tags: ["文档", "API"]
    },
    {
      id: 2,
      title: "代码审查：用户管理模块",
      description: "审查新同事提交的用户管理功能代码",
      priority: "medium",
      dueDate: "2024-01-16",
      status: "in-progress",
      tags: ["代码审查", "用户管理"]
    },
    {
      id: 3,
      title: "准备周会演示材料",
      description: "准备本周工作进展的演示PPT",
      priority: "high",
      dueDate: "2024-01-14",
      status: "pending",
      tags: ["演示", "周会"]
    },
    {
      id: 4,
      title: "修复生产环境bug",
      description: "用户反馈的登录页面显示异常问题",
      priority: "urgent",
      dueDate: "2024-01-13",
      status: "pending",
      tags: ["bug修复", "生产环境"]
    }
  ];

  const [importantEmails, setImportantEmails] = useState<ImportantEmail[]>([]);
  const [suggestedNextSteps, setSuggestedNextSteps] = useState<SuggestedNextStep[]>([]);

  useEffect(() => {
    // 模拟一些邮件数据，以便 getSmartMailAssistantSuggestions 可以处理
    const mockEmails: EmailMessage[] = [
      {
        id: 'email-1',
        uid: 1,
        subject: 'Urgent: Action Required on Project X',
        from: { name: 'Alice', address: 'alice@example.com' },
        to: [],
        date: new Date(),
        text: 'Please review the attached document and provide your feedback by end of day.',
        attachments: [],
        flags: [],
        isRead: false,
        isFlagged: false,
        isAnswered: false,
        isDeleted: false,
      },
      {
        id: 'email-2',
        uid: 2,
        subject: 'Meeting Reminder: Project Sync',
        from: { name: 'Bob', address: 'bob@example.com' },
        to: [],
        date: new Date(),
        text: 'Just a reminder about our project sync meeting tomorrow at 10 AM.',
        attachments: [],
        flags: [],
        isRead: true,
        isFlagged: false,
        isAnswered: false,
        isDeleted: false,
      },
      {
        id: 'email-3',
        uid: 3,
        subject: 'Weekly Report',
        from: { name: 'Charlie', address: 'charlie@example.com' },
        to: [],
        date: new Date(),
        text: 'Here is the weekly report for your review.',
        attachments: [],
        flags: [],
        isRead: false,
        isFlagged: false,
        isAnswered: false,
        isDeleted: false,
      },
    ];

    getSmartMailAssistantSuggestions(mockEmails).then(result => {
      setImportantEmails(result.importantEmails);
      setSuggestedNextSteps(result.suggestedNextSteps);
    });
  }, []);

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">作战指挥室</h1>
        <p className="text-gray-600">今天我必须做什么</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 任务列表 - 占据2/3宽度 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">待办任务</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">共 {tasks.length} 项</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    添加任务
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 重要邮件和建议的下一步工作 - 占据1/3宽度 */}
        <div className="lg:col-span-1 space-y-6">
          {importantEmails.length > 0 && (
            <EmailSection title="重要邮件" emails={importantEmails.map(ie => {
              // 查找对应的原始邮件数据，以便 EmailSection 可以正确渲染
              const originalEmail = mockEmails.find(e => e.id === ie.id);
              return originalEmail ? { ...originalEmail, subject: ie.subject, preview: ie.summary } : null;
            }).filter(Boolean) as any} />
          )}

          {suggestedNextSteps.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">建议的下一步工作</h2>
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
          )}
        </div>
      </div>
    </div>
  );
}