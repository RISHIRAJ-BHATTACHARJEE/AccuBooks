# AccuBooks - Professional Accounting Software

A modern, full-stack accounting application built with Next.js, TypeScript, Express, and Supabase.

## Features

✅ **User Authentication**
- Email/password signup and login
- Google OAuth integration
- Secure session management with Supabase Auth

✅ **Category Management**
- Create custom categories for income and purchases
- Color-coded organization
- Separate income and expense categories

✅ **Income Tracking**
- Add income entries with amount, category, description, and date
- View all income in a sortable table
- Edit and delete entries
- Track total income

✅ **Purchase Tracking**
- Add purchases with name, description, amount, category, and date
- Comprehensive purchase history
- Full CRUD operations
- Track total expenses

✅ **Analytics Dashboard**
- Visual pie charts showing spending by category
- Bar charts comparing income vs expenses
- Line charts displaying monthly trends
- Real-time financial summary statistics

✅ **Beautiful UI**
- Dark theme with emerald accents
- Smooth animations and transitions
- Responsive design for all devices
- Professional, modern interface

## Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (data visualization)
- Lucide React (icons)
- Supabase Client

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL database)
- Row Level Security (RLS)
- RESTful API

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account ([supabase.com](https://supabase.com))
- Git

### 1. Clone Repository
\`\`\`bash
cd d:/FREELANCE/AccuBooks
\`\`\`

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `backend/schema.sql`
3. Enable Google OAuth (optional):
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 3. Backend Setup

\`\`\`bash
cd backend
npm install
\`\`\`

Create `.env` file:
\`\`\`env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=5000
FRONTEND_URL=http://localhost:3000
\`\`\`

Start backend server:
\`\`\`bash
node server.js
\`\`\`

### 4. Frontend Setup

\`\`\`bash
cd frontend
npm install
\`\`\`

Create `.env.local` file:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

Start frontend dev server:
\`\`\`bash
npm run dev
\`\`\`

### 5. Access Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Getting Started

1. **Sign Up**: Create an account using email/password or Google OAuth
2. **Create Categories**: Set up categories for organizing your finances
   - Income categories (e.g., "Salary", "Freelance", "Investments")
   - Purchase categories (e.g., "Groceries", "Entertainment", "Utilities")

3. **Add Transactions**:
   - Click "Add Income" to record income
   - Click "Add Purchase" to record expenses
   - Assign categories to organize your data

4. **View Analytics**: Navigate to Analytics to see visual insights
   - Pie charts show spending breakdown
   - Bar charts compare income vs expenses
   - Line charts display trends over time

### Key Pages

- **Dashboard**: Overview with summary statistics and quick actions
- **Income**: View and manage all income entries
- **Purchases**: Track all expenses and purchases
- **Categories**: Create and organize categories
- **Analytics**: Visual charts and financial insights

## Project Structure

\`\`\`
AccuBooks/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── categories.js    # Category CRUD
│   │   ├── income.js        # Income CRUD
│   │   ├── purchases.js     # Purchase CRUD
│   │   └── analytics.js     # Analytics data
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   ├── schema.sql           # Database schema
│   └── server.js            # Express server
│
└── frontend/
    ├── app/
    │   ├── dashboard/       # Dashboard pages
    │   ├── login/           # Login page
    │   ├── signup/          # Signup page
    │   └── page.tsx         # Landing page
    ├── components/          # Reusable components
    ├── context/             # React contexts
    └── types/               # TypeScript types
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/oauth/google` - Google OAuth
- `POST /api/auth/logout` - Logout

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Income
- `GET /api/income` - List income
- `POST /api/income` - Add income
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income

### Purchases
- `GET /api/purchases` - List purchases
- `POST /api/purchases` - Add purchase
- `PUT /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Analytics
- `GET /api/analytics/summary` - Financial summary
- `GET /api/analytics/by-category` - Category breakdown
- `GET /api/analytics/trends` - Monthly trends

## Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication
- Secure password hashing
- Protected API endpoints
- CORS configuration

## Contributing

This is a personal project. Feel free to fork and customize for your needs.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Supabase
