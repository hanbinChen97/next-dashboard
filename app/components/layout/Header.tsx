'use client';

import { useState } from 'react';
import LoginButton from '../common/LoginButton';
import UserAvatar from '../common/UserAvatar';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  const handleLogin = () => {
    // 模拟登录
    setIsAuthenticated(true);
    setUser({
      name: '张三',
      email: 'zhangsan@example.com',
      avatar: '/api/placeholder/40/40'
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">任务指挥中心</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated && user ? (
            <UserAvatar user={user} onLogout={handleLogout} />
          ) : (
            <LoginButton onLogin={handleLogin} />
          )}
        </div>
      </div>
    </header>
  );
} 