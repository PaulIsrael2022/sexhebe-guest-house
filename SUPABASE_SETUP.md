# Supabase Setup Instructions

## 1. Create a Supabase Project
1. Go to https://supabase.com
2. Sign in or create an account
3. Create a new project
4. Choose a name and password for your project
5. Select a region closest to your users
6. Wait for the project to be created

## 2. Run Database Migrations
1. Install Supabase CLI if not already installed:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Initialize Supabase in your project:
```bash
supabase init
```

4. Link your project:
```bash
supabase link --project-ref your-project-ref
```

5. Run the migrations:
```bash
supabase db push
```

## 3. Set Environment Variables
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the following variables in `.env`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

You can find these values in your Supabase project settings under Project Settings > API.

## 4. Update Dependencies
Make sure you have the required dependencies:
```bash
npm install @supabase/supabase-js
```

## 5. Verify Setup
1. Start your development server
2. Check the browser console for any connection errors
3. Try performing a test query to verify the connection

## Database Schema
The database includes the following tables:
- rooms
- guests
- bookings
- staff
- cleaning_tasks
- inventory
- inventory_transactions
- payments
- expenses
- quotations
- settings

Each table has appropriate indexes and relationships. Check the migration file in `supabase/migrations/create_tables.sql` for the complete schema.

## Type Safety
The project includes TypeScript types for all database tables. These are defined in `src/types/supabase.ts`.

## Next Steps
1. Replace the mock data with real data
2. Implement proper error handling
3. Add authentication and authorization
4. Set up proper backup procedures
