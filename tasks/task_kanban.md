# Task Dashboard Project Plan

## To Do

### Email Types & Interfaces Setup

  - tags: [email, types, foundation]
  - priority: medium
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [ ] Define email data structures
      - [ ] Create email service interfaces
      - [ ] Set up email utility functions
    ```md
    Set up foundational email types and interfaces:
    - Email message structure (subject, body, sender, recipients, etc.)
    - Email service interfaces for IMAP operations
    - Common utility functions for email processing
    
    Files to create/modify:
    - app/lib/email/types.ts: Email data types and interfaces
    - app/lib/email/utils.ts: Email utility functions
    - app/lib/email/constants.ts: Email-related constants
    ```

### Email List Component

  - tags: [email, frontend, ui, list]
  - priority: medium
  - workload: Medium
  - defaultExpanded: false
  - steps:
      - [ ] Design email list layout
      - [ ] Implement email fetching from server actions
      - [ ] Add email sorting and filtering UI
    ```md
    Create email list component:
    - Email list layout with proper spacing and typography
    - Integration with server actions for fetching emails
    - Email sorting (by date, sender, subject) and filtering options
    
    Files to create/modify:
    - app/components/EmailList.tsx: Email list component
    - app/components/EmailFilters.tsx: Email filtering controls
    - app/hooks/useEmails.ts: Email data fetching hook
    ```

### Email Card Component

  - tags: [email, frontend, ui, card]
  - priority: medium
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [ ] Design individual email card layout
      - [ ] Add email preview functionality
      - [ ] Implement email actions (reply, forward, delete)
    ```md
    Create individual email card component:
    - Email card design with sender, subject, preview, and timestamp
    - Email preview with truncated content
    - Quick action buttons for common email operations
    
    Files to create/modify:
    - app/components/EmailCard.tsx: Individual email card component
    - app/components/EmailActions.tsx: Email action buttons
    - app/components/EmailPreview.tsx: Email preview component
    ```

### Email Interface Integration

  - tags: [email, frontend, ui, integration]
  - priority: medium
  - workload: Medium
  - defaultExpanded: false
  - steps:
      - [ ] Create main email interface layout
      - [ ] Integrate email list and card components
      - [ ] Add email authentication status display
    ```md
    Integrate email components into main interface:
    - Main email interface layout with sidebar and content area
    - Integration of email list and card components
    - Email account status and authentication indicators
    
    Files to create/modify:
    - app/components/EmailInterface.tsx: Main email interface component
    - app/components/EmailSidebar.tsx: Email sidebar with accounts
    - app/components/EmailStatus.tsx: Email authentication status
    ```

### Email Search & Advanced Features

  - tags: [email, search, features, enhancement]
  - priority: low
  - workload: Medium
  - defaultExpanded: false
  - steps:
      - [ ] Implement email search functionality
      - [ ] Add email categorization features
      - [ ] Create email composer interface
    ```md
    Add advanced email features:
    - Full-text email search across subjects and content
    - Email categorization (important, regular, spam)
    - Email composition interface for new emails
    
    Files to create/modify:
    - app/components/EmailSearch.tsx: Email search component
    - app/components/EmailComposer.tsx: Email composition interface
    - app/components/EmailCategories.tsx: Email categorization controls
    ```

### Design System & Styling

  - tags: [design, ui, frontend, styling]
  - priority: low
  - defaultExpanded: true
  - steps:
      - [ ] Define color palette
      - [ ] Create typography system
      - [ ] Design component library
      - [ ] Implement consistent spacing
    ```md
    Create a cohesive design system with:
    - Consistent color scheme
    - Typography hierarchy
    - Component patterns
    - Spacing guidelines
    
    Files to modify:
    - app/globals.css: Global styles and CSS variables
    - app/components/ui/Button.tsx: Reusable button component
    - app/components/ui/Card.tsx: Reusable card component
    ```

## In Progress

## Done

### Email Frontend Integration

  - tags: [email, frontend, integration]
  - priority: high
  - workload: Medium
  - defaultExpanded: false
  - steps:
      - [x] Update mails/page.tsx to use server actions
      - [x] Implement email fetching from _action_server.ts
      - [x] Add loading states and error handling
      - [x] Create email display components
    ```md
    Integrate email functionality in frontend:
    - Update mails page to call server actions
    - Implement email fetching using getEmails function
    - Add proper loading and error states
    - Create email list and card components
    
    Files to create/modify:
    - app/mails/page.tsx: Main emails page with server action integration
    - app/components/EmailList.tsx: Email list component
    - app/components/EmailCard.tsx: Individual email card
    - app/hooks/useEmails.ts: Email data fetching hook
    ```

### Email Server Actions

  - tags: [email, server-actions, backend]
  - priority: high
  - workload: Medium
  - defaultExpanded: false
  - steps:
      - [x] Create _action_server.ts for email operations
      - [x] Implement getEmails function
      - [x] Add email filtering and pagination
      - [x] Handle authentication and error states
    ```md
    Create server actions for email operations:
    - Use Next.js server actions instead of API routes
    - Implement getEmails function for fetching emails
    - Add email filtering by date, sender, subject
    - Handle authentication and connection errors
    
    Files to create/modify:
    - app/lib/email/_action_server.ts: Email server actions
    - app/lib/email/email-service.ts: Email service layer
    - app/lib/email/cache.ts: Email caching mechanism
    ```

### Exchange IMAP Integration

  - tags: [email, exchange, imap, backend]
  - priority: high
  - workload: Medium
  - defaultExpanded: false
  - steps:
      - [x] Create Exchange IMAP connection service
      - [x] Implement email fetching logic
      - [x] Add email parsing with mailparser
      - [x] Handle connection errors and timeouts
    ```md
    Implement Exchange IMAP integration:
    - Connect to Exchange server using IMAP protocol
    - Fetch emails from specified folders
    - Parse email content using mailparser
    - Handle authentication and connection management
    
    Files to create/modify:
    - app/lib/email/exchange-imap.ts: Exchange IMAP connection and email fetching
    - app/lib/email/email-parser.ts: Email parsing utilities
    - app/lib/email/types.ts: Email data types and interfaces
    ```

### Email Dependencies Setup

  - tags: [email, setup, dependencies]
  - priority: high
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [x] Install imap-simple library
      - [x] Install mailparser library
      - [x] Configure environment variables
    ```md
    Set up email processing dependencies:
    - Install imap-simple for IMAP connection
    - Install mailparser for email content parsing
    - Configure Exchange server environment variables
    
    Environment variables to set:
    - EXCHANGE_USERNAME=xxxx
    - EXCHANGE_KEY=ssss
    - EXCHANGE_SERVER=mail.rwth-aachen.de
    - EXCHANGE_PORT_POP=995
    - EXCHANGE_PORT_IMAP=993
    - EXCHANGE_PORT_SMTP=587
    
    Files to modify:
    - package.json: Add imap-simple and mailparser dependencies
    - .env.local: Configure Exchange server settings
    ```

### Project Setup

  - tags: [setup, frontend]
  - priority: high
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [x] Initialize Next.js project
      - [x] Set up TypeScript
      - [x] Configure Tailwind CSS
      - [x] Set up project structure
    ```md
    Basic project setup and configuration
    
    Files to modify:
    - package.json: Add Tailwind CSS dependencies
    - tailwind.config.js: Configure Tailwind CSS
    - app/globals.css: Set up base styles and Tailwind directives
    ```

### Design Header Component

  - tags: [design, ui, frontend, header]
  - priority: high
  - defaultExpanded: false
  - steps:
      - [x] Design login button layout
      - [x] Design user avatar component
      - [x] Design dropdown menu for user actions
      - [x] Implement logout functionality UI
    ```md
    Create a responsive header with:
    - Login button (when not authenticated)
    - User avatar (when authenticated)
    - Dropdown menu with logout option
    - Clean, modern design with proper spacing
    
    Files to modify:
    - app/components/Header.tsx: Main header component with layout
    - app/components/UserAvatar.tsx: User avatar and dropdown menu
    - app/components/LoginButton.tsx: Login button component
    ```

### Design Sidebar Navigation

  - tags: [design, ui, frontend, sidebar]
  - priority: high
  - defaultExpanded: false
  - steps:
      - [x] Design sidebar container layout
      - [x] Create navigation menu items
      - [x] Add active state styling
      - [x] Implement responsive behavior
    ```md
    Design a sidebar with navigation structure:
    - 🏠 Home: "作战指挥室" - 聚焦于"今天我必须做什么"
    - 📂 Projects: "核心工作区" - 管理深度参与的项目
    - 🔭 Following: "雷达扫描区" - 保持对次要项目的感知
    - --- (分割线)
    - ⚙️ Settings: 设置中心
    
    Files to modify:
    - app/components/Sidebar.tsx: Main sidebar container with navigation
    - app/components/Navigation.tsx: Navigation menu structure
    - app/components/NavItem.tsx: Individual navigation items with icons
    ```

### Design My Tasks Interface

  - tags: [design, ui, frontend, tasks]
  - priority: high
  - workload: Hard
  - defaultExpanded: false
  - steps:
      - [x] Design task list layout
      - [x] Create task card component
      - [x] Design important emails section
      - [x] Add task filtering and sorting UI
    ```md
    Home interface - "作战指挥室":
    - Tasks waiting to be done (今天我必须做什么)
    - Important emails section (重要邮件)
    - Task priority indicators and due dates
    - Quick action buttons for task management
    
    Files to modify:
    - app/pages/home/page.tsx: Main home page layout
    - app/components/TaskCard.tsx: Individual task card component
    - app/components/EmailSection.tsx: Important emails section
    ```

### Design Active Projects Interface

  - tags: [design, ui, frontend, projects]
  - priority: medium
  - workload: Hard
  - defaultExpanded: false
  - steps:
      - [x] Design project grid layout
      - [x] Create project card component
      - [x] Design regular emails section
      - [x] Add project status indicators
    ```md
    Projects interface - "核心工作区":
    - Projects I'm actively involved in (leading, participating, responsible)
    - Regular emails section (不重要邮件)
    - Project progress indicators and status
    - Team member avatars and collaboration tools
    
    Files to modify:
    - app/pages/projects/page.tsx: Main projects page layout
    - app/components/ProjectCard.tsx: Project card component
    - app/components/ProjectGrid.tsx: Project grid layout
    ```

### Design Followed Projects Interface

  - tags: [design, ui, frontend, projects]
  - priority: medium
  - defaultExpanded: false
  - steps:
      - [x] Design followed projects layout
      - [x] Create project summary cards
      - [x] Add project activity feed
      - [x] Design notification indicators
    ```md
    Following interface - "雷达扫描区":
    - Projects I'm following (weakly related)
    - Project updates and notifications
    - Activity timeline and recent changes
    - Quick access to project details and status
    
    Files to modify:
    - app/pages/following/page.tsx: Following projects page layout
    - app/components/ProjectSummary.tsx: Project summary cards
    - app/components/ActivityFeed.tsx: Activity timeline component
    ```

### Implement Responsive Layout

  - tags: [design, ui, frontend, responsive]
  - priority: medium
  - defaultExpanded: false
  - steps:
      - [x] Test mobile layout
      - [x] Implement sidebar collapse on mobile
      - [x] Optimize header for small screens
      - [x] Ensure touch-friendly interactions
    ```md
    Ensure the dashboard works well on:
    - Desktop (1200px+)
    - Tablet (768px-1199px)
    - Mobile (320px-767px)
    
    Files to modify:
    - app/layout.tsx: Main layout with responsive container
    - app/components/Sidebar.tsx: Responsive sidebar behavior
    - app/components/Header.tsx: Responsive header layout
    ```

### Optimize Projects Interface

  - tags: [design, ui, frontend, projects, optimization]
  - priority: medium
  - workload: Easy
  - defaultExpanded: false
  - steps:
      - [x] Add project filtering options
      - [x] Improve project card hover effects
      - [x] Add project search functionality
      - [x] Optimize email section layout
    ```md
    Enhanced the existing Projects interface with:
    - Filter projects by status, priority, team member
    - Better visual feedback and interactions with hover effects
    - Search functionality for projects (name, description, team members)
    - Improved email section with sticky positioning and better spacing
    
    Files modified:
    - app/pages/projects/page.tsx: Added filtering and search UI, optimized email layout
    - app/components/ProjectCard.tsx: Enhanced hover effects with transform and border changes
    - app/components/ProjectGrid.tsx: Added filter controls and search functionality
    ```

