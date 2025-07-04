import NavItem from './NavItem';

interface NavigationProps {
  isCollapsed: boolean;
}

type NavItemType = {
  icon: string;
  label: string;
  href: string;
  description: string;
} | {
  type: "divider";
};

export default function Navigation({ isCollapsed }: NavigationProps) {
  const navItems: NavItemType[] = [
    {
      icon: "🏠",
      label: "作战指挥室",
      href: "/",
      description: "今天我必须做什么"
    },
    {
      icon: "📂",
      label: "核心工作区",
      href: "/projects",
      description: "管理深度参与的项目"
    },
    {
      icon: "🔭",
      label: "雷达扫描区",
      href: "/following",
      description: "保持对次要项目的感知"
    },
    {
      type: "divider"
    },
    {
      icon: "📧",
      label: "邮件中心",
      href: "/mails",
      description: "查看所有邮件"
    },
    {
      icon: "📋",
      label: "项目管理",
      href: "/all-projects",
      description: "显示所有项目"
    },
    {
      type: "divider"
    },

    {
      icon: "⚙️",
      label: "设置中心",
      href: "/settings",
      description: "系统设置"
    }
  ];

  return (
    <nav className="flex-1 px-4 pb-4">
      <ul className="space-y-2">
        {navItems.map((item, index) => (
          <li key={index}>
            {'type' in item && item.type === "divider" ? (
              <div className="border-t border-gray-200 my-4" />
            ) : (
              <NavItem
                icon={(item as NavItemType & { icon: string }).icon}
                label={(item as NavItemType & { label: string }).label}
                href={(item as NavItemType & { href: string }).href}
                description={(item as NavItemType & { description: string }).description}
                isCollapsed={isCollapsed}
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
} 