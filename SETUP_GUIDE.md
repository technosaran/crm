# Quick Setup Guide for Zenith CRM

This guide will help you get the CRM up and running in minutes.

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18 or higher installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] A Supabase account (free at [supabase.com](https://supabase.com))
- [ ] Git (to clone the repository)

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages. Should take 1-2 minutes.

### Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name and database password
   - Wait for the project to be created (2-3 minutes)

2. **Get Your API Credentials**
   - In your Supabase project, go to **Settings** > **API**
   - Find and copy:
     - **Project URL** (looks like `https://abcdefgh.supabase.co`)
     - **anon public key** (long string of characters)

### Step 3: Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** and paste your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Step 4: Set Up the Database

1. **Open Supabase SQL Editor**
   - In your Supabase project dashboard
   - Click on **SQL Editor** in the left sidebar

2. **Run the Schema**
   - Open the file `database/schema.sql` from this project
   - Copy ALL the contents
   - Paste into the Supabase SQL Editor
   - Click **Run** (bottom right)
   - Wait for "Success" message

3. **Verify Tables Created**
   - Click on **Table Editor** in Supabase
   - You should see tables like: `user_profiles`, `leads`, `contacts`, `opportunities`, etc.

### Step 5: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Create Your Account

1. **Sign Up**
   - Click "Sign Up" or go to `/login`
   - Enter your email and create a password
   - Check your email for verification (if required by Supabase settings)

2. **Make Yourself an Admin**
   - Go back to Supabase SQL Editor
   - Run this query (replace with your email):
   ```sql
   UPDATE user_profiles
   SET role = 'SUPER_ADMIN'
   WHERE email = 'your-email@example.com';
   ```
   - Click **Run**

3. **Log In**
   - Go back to the CRM app
   - Log out if you're still logged in
   - Log in again with your credentials
   - You should now have full admin access!

## Testing Your Setup

### Test 1: Can you log in?
- ✅ Yes → Great! Your authentication is working.
- ❌ No → Check your Supabase credentials in `.env.local`

### Test 2: Can you create a lead?
1. Click **Leads** in the sidebar
2. Click **New Lead**
3. Fill in the form and save
- ✅ Success toast appears → Database is working!
- ❌ Error → Check that database schema was set up correctly

### Test 3: Can you create a contact?
1. Click **Contacts** in the sidebar
2. Click **New Contact**
3. Fill in the form and save
- ✅ Contact appears in the list → Everything is working!

## What to Do If Something Goes Wrong

### "Can't connect to database"
- Check `.env.local` has the correct Supabase URL and key
- Make sure your Supabase project is not paused (happens on free tier after inactivity)

### "Table doesn't exist"
- You need to run the `database/schema.sql` in Supabase SQL Editor
- Make sure the SQL ran without errors

### "Authentication error"
- Verify your Supabase anon key is correct
- Check that Email Auth is enabled in Supabase (Settings > Authentication > Providers)

### "Build fails"
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then reinstall: `npm install && npm run dev`

### "Features not working after login"
- Make sure you set your user role to 'SUPER_ADMIN' in the database
- Log out and log back in after changing the role

## Next Steps

Once everything is working:

1. **Explore the CRM**
   - Try creating leads, contacts, and opportunities
   - Check out the dashboard and analytics

2. **Customize for Your Business**
   - Update branding and colors in `src/app/globals.css`
   - Modify user roles in `src/lib/rbac.ts`

3. **Deploy to Production**
   - See `DEPLOYMENT_CHECKLIST.md` for production deployment guide
   - Recommended: Deploy to [Vercel](https://vercel.com) for easiest setup

## Getting Help

- Check the main [README.md](./README.md) for detailed documentation
- Review [SECURITY_ENHANCEMENTS.md](./SECURITY_ENHANCEMENTS.md) for security information
- See [database/README.md](./database/README.md) for database details
- Open an issue on GitHub if you need help

---

**Estimated Setup Time**: 15-20 minutes

**Need Help?** Don't hesitate to open an issue with your question!
