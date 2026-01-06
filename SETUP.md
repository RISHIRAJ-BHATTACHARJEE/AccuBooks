# AccuBooks Setup Guide

## Quick Start

### 1. Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in project details and wait for database to initialize
4. Go to **SQL Editor** → Click "New Query"
5. Copy and paste the entire contents of `backend/schema.sql`
6. Click "Run" to create all tables and security policies

**Get Your Credentials:**
- Go to **Settings** → **API**
- Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
- Copy your **anon/public key** (starts with `eyJ...`)
- Copy your **service_role key** (starts with `eyJ...`)

### 2. Backend Setup (2 minutes)

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Start the server:
```bash
node server.js
```

You should see: `AccuBooks server running on port 5000`

### 3. Frontend Setup (2 minutes)

```bash
cd frontend
npm install  # Already running
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Optional: Google OAuth Setup

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Follow Supabase's instructions to:
   - Create Google OAuth app
   - Add authorized redirect URIs
   - Copy Client ID and Secret to Supabase

---

## Testing the Application

### First Time Setup

1. **Create Account**: Click "Sign up" and create an account
2. **Create Categories**:
   - Go to Categories page
   - Click "New Category"
   - Create income categories: "Salary", "Freelance", "Investments"
   - Create purchase categories: "Groceries", "Rent", "Entertainment"

3. **Add Income**:
   - Go to Income page
   - Click "Add Income"
   - Amount: 5000, Category: Salary, Date: today
   - Add a few more entries

4. **Add Purchases**:
   - Go to Purchases page
   - Click "Add Purchase"
   - Name: "Grocery Shopping", Amount: 150, Category: Groceries
   - Add several more purchases

5. **View Analytics**:
   - Go to Analytics page
   - See your data visualized in charts!

---

## Troubleshooting

### Backend won't start
- Check if `.env` file exists in backend folder
- Verify Supabase credentials are correct
- Make sure port 5000 is not in use

### Frontend won't start
- Check if `.env.local` file exists in frontend folder
- Verify Supabase URL and key are correct
- Try deleting `node_modules` and running `npm install` again

### Can't login
- Check if backend server is running
- Verify Supabase credentials match in both backend and frontend
- Check browser console for errors

### Charts not showing
- Make sure you have added some income and purchase entries
- Check if backend analytics endpoint is working
- Verify API_URL in frontend `.env.local`

---

## File Structure

```
AccuBooks/
├── backend/
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── schema.sql       # Database schema
│   ├── server.js        # Express server
│   ├── .env            # Backend config (create this)
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── dashboard/   # Protected pages
    │   ├── login/       # Login page
    │   ├── signup/      # Signup page
    │   └── page.tsx     # Landing page
    ├── components/      # Reusable UI components
    ├── context/         # React contexts
    ├── types/           # TypeScript types
    ├── .env.local      # Frontend config (create this)
    └── package.json
```

---

## Environment Variables Reference

### Backend `.env`
```env
SUPABASE_URL=              # Your Supabase project URL
SUPABASE_ANON_KEY=         # Supabase anon/public key
SUPABASE_SERVICE_KEY=      # Supabase service role key
PORT=5000                  # Backend server port
FRONTEND_URL=http://localhost:3000  # Frontend URL for CORS
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=  # Same as backend SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Same as backend SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Backend API URL
```

---

## Development Tips

- Use Chrome DevTools to inspect network requests
- Check browser console for frontend errors
- Check terminal for backend errors
- Use Supabase Dashboard to view database tables directly
- Test API endpoints with Postman or Thunder Client

---

## Next Steps

Once everything is working:
1. Customize the color scheme in `frontend/app/globals.css`
2. Add more features (budgets, recurring transactions, etc.)
3. Deploy to production (Vercel for frontend, Railway/Render for backend)
4. Set up custom domain
5. Add email notifications

---

Need help? Check the main [README.md](file:///d:/FREELANCE/AccuBooks/README.md) for more details!
