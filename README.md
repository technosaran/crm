# Zenith CRM - Complete Customer Relationship Management System

A modern, secure, and feature-rich CRM application built with Next.js 16, TypeScript, Supabase, and Tailwind CSS.

## 🚀 Features

### Core Modules
- **Leads Management** - Track and convert potential customers
- **Contacts Management** - Manage business relationships
- **Accounts Management** - Track company information
- **Opportunities** - Sales pipeline with Kanban view
- **Tasks** - Personal and team task management
- **Cases** - Customer support ticket system
- **Calendar** - Schedule and manage events
- **Reports & Analytics** - Business intelligence dashboard
- **Files** - Document management system

### Security Features 🔒
- **Authentication** - Secure login with Supabase Auth
- **Authorization** - Role-Based Access Control (RBAC)
- **Row Level Security** - Database-level data protection
- **Input Validation** - XSS and SQL injection prevention
- **Security Headers** - Protection against common web vulnerabilities
- **Audit Logging** - Track all system changes

### User Roles
- **Super Admin** - Full system access
- **Admin** - Manage users and all records
- **Manager** - View all records, manage team
- **Sales** - Manage own leads and opportunities
- **Support** - Handle customer cases
- **Guest** - Limited read-only access

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier available)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd crm
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > API to find your credentials
3. Copy your project URL and anon key

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Database

1. Open the Supabase SQL Editor
2. Copy the contents of `database/schema.sql`
3. Execute the SQL to create tables and policies
4. See `database/README.md` for detailed instructions

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Your First Admin User

1. Sign up through the login page
2. In Supabase SQL Editor, run:

```sql
UPDATE public.user_profiles
SET role = 'SUPER_ADMIN'
WHERE email = 'your-email@example.com';
```

## 🏗️ Project Structure

```
crm/
├── src/
│   ├── app/              # Next.js 16 App Router pages
│   ├── components/       # React components
│   │   ├── layout/       # Shell, navigation, sidebar
│   │   ├── leads/        # Lead management UI
│   │   ├── crm/          # Kanban, pipeline views
│   │   └── shared/       # Reusable components
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.ts    # Authentication
│   │   ├── useLeads.ts   # Leads CRUD
│   │   ├── useContacts.ts # Contacts CRUD
│   │   ├── useTasks.ts   # Tasks CRUD
│   │   └── useCases.ts   # Cases CRUD
│   ├── lib/              # Utilities
│   │   ├── supabase.ts   # Supabase client
│   │   ├── rbac.ts       # Role & permissions
│   │   ├── validation.ts # Input validation
│   │   └── utils.ts      # Helper functions
│   ├── services/         # Business logic
│   ├── store/            # Global state (Zustand)
│   ├── types/            # TypeScript types
│   └── middleware.ts     # Auth & security middleware
├── database/
│   ├── schema.sql        # Database schema with RLS
│   └── README.md         # Database setup guide
├── public/               # Static assets
└── package.json
```

## 🔐 Security

This CRM implements enterprise-grade security:

### Authentication & Authorization
- Server-side session validation
- Protected routes via middleware
- Role-based access control (6 roles, 30+ permissions)
- Row Level Security (RLS) at database level

### Data Protection
- Input sanitization (XSS prevention)
- SQL injection prevention
- CSRF protection via Supabase
- Secure password hashing
- Encrypted data in transit

### Security Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection enabled
- Referrer-Policy configured

See `SECURITY_ENHANCEMENTS.md` for complete security documentation.

## 📚 Usage

### Managing Leads
1. Navigate to "Leads" from the sidebar
2. Click "New Lead" to create a lead
3. Fill in required fields (validated automatically)
4. Convert qualified leads to opportunities

### Managing Contacts
1. Go to "Contacts" page
2. Create contacts associated with accounts
3. Track communication history
4. Mark primary contacts for accounts

### Sales Pipeline
1. Navigate to "Opportunities"
2. View Kanban board of all opportunities
3. Drag cards to move through stages
4. Track deal progress and close dates

### Task Management
1. Create tasks from any page
2. Assign to team members
3. Set due dates and priorities
4. Track completion status

### Support Cases
1. Create cases from customer inquiries
2. Set priority and type
3. Track resolution time
4. Link to accounts and contacts

## 🎨 Customization

### Adding New Roles

Edit `src/lib/rbac.ts`:

```typescript
export enum Role {
    // Add your role
    CUSTOM_ROLE = 'CUSTOM_ROLE',
}

// Define permissions
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [Role.CUSTOM_ROLE]: [
        Permission.VIEW_LEADS,
        // Add permissions
    ],
};
```

### Adding New Permissions

Edit `src/lib/rbac.ts`:

```typescript
export enum Permission {
    // Add new permission
    MANAGE_CUSTOM_ENTITY = 'MANAGE_CUSTOM_ENTITY',
}
```

### Theming

Edit `src/app/globals.css` to customize colors and styles.

## 🧪 Development

### Run Linter

```bash
npm run lint
```

### Build for Production

```bash
npm run build
npm run start
```

### Type Checking

```bash
npx tsc --noEmit
```

## 📦 Dependencies

### Core
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Backend
- **Supabase** - Authentication, database, and RLS
- **@supabase/ssr** - Server-side rendering support

### UI Libraries
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **Headless UI** - Accessible components

### State Management
- **Zustand** - Global state

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Docker

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linter and tests
5. Submit a pull request

## 📝 License

This project is for educational and commercial use.

## 🆘 Support

For issues and questions:
1. Check `SECURITY_ENHANCEMENTS.md`
2. Check `database/README.md`
3. Review Supabase documentation
4. Open an issue on GitHub

## ✅ Checklist for Production

- [ ] Update all environment variables
- [ ] Enable RLS on all tables
- [ ] Configure CORS settings
- [ ] Set up database backups
- [ ] Enable monitoring and logging
- [ ] Configure CDN for assets
- [ ] Set up error tracking
- [ ] Enable rate limiting
- [ ] Review security headers
- [ ] Test all user roles and permissions
- [ ] Perform security audit
- [ ] Set up CI/CD pipeline

---

Built with ❤️ for modern businesses
