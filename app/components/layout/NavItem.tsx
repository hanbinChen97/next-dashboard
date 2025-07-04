'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  icon: string;
  label: string;
  href: string;
  description: string;
  isCollapsed: boolean;
}

export default function NavItem({ icon, label, href, description, isCollapsed }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div className={`
        group relative flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200 touch-manipulation min-h-[48px]
        ${isActive 
          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
          : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
        }
      `}>
        {/* 图标 */}
        <span className="text-lg mr-3 flex-shrink-0">{icon}</span>
        
        {/* 标签和描述 */}
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="font-medium">{label}</div>
            <div className={`text-xs text-gray-500 transition-opacity duration-200 ${
              isCollapsed ? 'opacity-0' : 'opacity-100'
            }`}>
              {description}
            </div>
          </div>
        )}

        {/* 折叠时的工具提示 */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="font-medium">{label}</div>
            <div className="text-gray-300">{description}</div>
          </div>
        )}
      </div>
    </Link>
  );
} 