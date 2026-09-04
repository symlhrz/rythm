# Progress Tracker

A simple personal web app to log activities (like push-ups, running, etc.)
and see your progress over time — daily totals, weekly charts, and when
you last did each activity.

You don't need to know how to code to use this. Once it's deployed
(see below), you just open a link in your browser like any website.

## What it does

- **Dashboard** — a weekly bar chart for each activity, plus your total
  for the week and when you last logged it
- **Log Entry** — a simple form: pick the activity, the date, how much
  you did, and any notes
- **History** — a list of everything you've logged, with the option to
  delete entries

## Deploying this so you can use it (step by step)

You'll need two free accounts: **GitHub** (to hold the code) and
**Vercel** (to host the app). Neither requires coding.

### 1. Put this code on GitHub

1. Go to github.com and sign up if you don't have an account.
2. Click the **+** in the top right -> **New repository**. Give it any
   name (e.g. `progress-tracker`) and click **Create repository**.
3. On the next page, look for "uploading an existing file" and
   upload the contents of this project folder (everything except the
   `node_modules` folder, if present -- it won't be, in what you were given).

### 2. Deploy it on Vercel

1. Go to vercel.com and sign up using your GitHub account (this makes
   step 2 easier).
2. Click **Add New -> Project**, and select the GitHub repository you
   just created.
3. Click **Deploy**. Vercel will build the app automatically. It may
   show an error the first time -- that's expected, because there's no
   database connected yet. That's the next step.

### 3. Connect a database (a few clicks, no typing)

1. In your Vercel project, click the **Storage** tab.
2. Click **Create Database** and choose the **Postgres** option
   (sometimes listed as a Neon integration -- that's the same thing).
3. Follow the prompts to create it and connect it to your project.
   Vercel will automatically set up the connection for you -- you don't
   need to copy or paste any passwords.
4. Go to your project's **Deployments** tab and click **Redeploy** on
   the latest deployment, so it picks up the new database connection.

### 4. Set up the database tables (one-time)

The app needs its two tables (`activities` and `entries`) created once.
The easiest way: message me again once you've completed steps 1-3 and
share your database connection string (found in Vercel's Storage tab
under "Quickstart" -- look for a value starting with `postgres://`),
and I'll give you the exact one-time command to run, or walk you
through running it from Vercel's own interface.

### 5. You're done

Vercel will give you a link like `your-project.vercel.app`. Open it,
bookmark it on your phone's home screen, and start logging your
activities.

## Running it on your own computer (optional, for later)

If you ever want a developer to run this locally: copy `.env.example`
to `.env.local`, fill in `DATABASE_URL` with a Postgres connection
string, then run `npm install`, `npx drizzle-kit push`, and `npm run dev`.
