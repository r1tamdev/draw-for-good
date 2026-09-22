# DrawForGood

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)

DrawForGood is a full-stack platform that combines golf performance tracking, a subscription-based monthly prize draw, and charitable giving. Built as a sample assignment for the Digital Heroes trainee selection process.

## Features

- User registration and login with Supabase Authentication
- Monthly and yearly subscription plans via Stripe Checkout
- Golf Stableford score tracking (1–45 range)
- Automatic retention of the latest 5 scores per user
- One score per date, with edit and delete support
- Monthly draw system with random and algorithmic modes
- 3-number, 4-number, and 5-number prize tiers (25% / 35% / 40% pool split)
- Prize pool calculation based on active subscriber count
- Jackpot rollover for unclaimed 5-number prizes
- Equal prize splitting between multiple winners in the same tier
- Charity directory with search and detail pages
- Charity selection and adjustable contribution percentage (10% minimum)
- Winner proof submission, admin verification, and payout tracking
- Subscriber dashboard (subscription, scores, charity, participation, winnings)
- Admin dashboard (users, draws, charities, winners, reports)
- Responsive, dark-themed UI

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- Supabase JS client
- React Hook Form
- Lucide React (icons)

**Backend**
- Node.js
- Express.js
- Supabase JS client (service role)
- Stripe
- Joi (validation)
- CORS, cookie-parser, morgan, dotenv

**Database & Services**
- Supabase (PostgreSQL + Authentication)
- Stripe Checkout + Webhooks

## Project Structure

```
draw-for-good/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── webhooks/
│   │   ├── db/
│   │   │   ├── schema.sql
│   │   │   └── seed.sql
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Prerequisites

- Node.js (LTS)
- npm
- A Supabase account
- A Stripe account

## Environment Variables

### Backend — `server/.env`

```
PORT=5000

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
STRIPE_PRICE_MONTHLY=your_monthly_price_id
STRIPE_PRICE_YEARLY=your_yearly_price_id

CLIENT_URL=http://localhost:5173
```

### Frontend — `client/.env`

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

**Never commit `.env` files or secret keys to GitHub.** Both `client/.gitignore` and `server/.gitignore` already exclude them.

## Supabase Setup

1. Create a new Supabase project (a fresh project, not a personal/existing one, per assignment requirements).
2. Open the SQL Editor and run `server/src/db/schema.sql` to create the tables.
3. Run `server/src/db/seed.sql` to seed sample charities and one historical draw.
4. Copy the Project URL, anon key, and service role key from **Settings → API** into both `.env` files as shown above.

Core tables: `profiles`, `subscriptions`, `scores`, `charities`, `draws`, `winners`.

## Stripe Setup

1. Create two recurring prices under one product in the Stripe Dashboard (test mode):
   - Monthly
   - Yearly
2. Copy each price's ID (`price_...`, not the product ID) into `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_YEARLY`.
3. For local development, run the Stripe CLI listener to get a webhook secret:
   ```
   stripe listen --forward-to localhost:5000/api/webhooks/stripe
   ```
4. For a deployed backend, add a webhook endpoint in the Stripe Dashboard pointing at:
   ```
   https://your-backend-url/api/webhooks/stripe
   ```
   Recommended events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.

## Running Locally

**Backend**
```
cd server
npm install
npm run dev
```
Runs on `http://localhost:5000`.

**Frontend** (in a separate terminal)
```
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## Draw System

- Random or algorithmic (score-frequency-weighted) number generation
- Admin-only simulate step (no data written) before publish (commits results and pays winners)
- Prize pool split: 5-match 40%, 4-match 35%, 3-match 25%
- Unclaimed 5-match jackpot rolls over to the next draw

## Score System

- Stableford scores, range 1–45
- One score per date (unique constraint enforced at the database level)
- Only the latest 5 scores are retained; the oldest is dropped automatically on a new entry
- Scores can be edited or deleted
- Displayed in reverse chronological order

## Charity System

- Charity directory with search
- Charity detail pages
- Charity selection and contribution percentage set during/after subscribing
- Selected charity shown on the subscriber dashboard

## Winner Verification

- Winners generated automatically when a published draw matches a subscriber's logged scores
- Winner submits proof (screenshot reference) from their dashboard
- Admin approves or rejects the submission
- Approved winners can be marked paid
- Payment states: Pending → Paid

## User Dashboard

- Subscription status and renewal date
- Score entry and management
- Selected charity and contribution percentage
- Upcoming draw
- Winnings overview and proof submission

## Admin Dashboard

- User management
- Draw configuration, simulation, and publishing
- Charity management
- Winner verification and payouts
- Reports (total users, total prize pool, average charity contribution, draws run)

## Deployment

Per assignment requirements, the app is deployed to a **new Vercel account** (not personal/existing), with a **new Supabase project** (not personal/existing).

- Deploy `client/` and `server/` as separate Vercel projects (or configure `server/` as Vercel serverless functions if adapting the Express app for that runtime).
- Set all backend environment variables in the Vercel project settings, updating `CLIENT_URL` to the deployed frontend URL.
- Set all frontend environment variables in the Vercel project settings, updating `VITE_API_URL` to the deployed backend URL (including the `/api` suffix).
- Reconfigure the Stripe webhook endpoint to point at the deployed backend URL once live.

## Security

- `.env` files are never committed (enforced via `.gitignore` in both `client/` and `server/`)
- The Supabase service role key is used only on the backend, never exposed to the frontend
- The Stripe secret key is used only on the backend
- The Supabase anon key is the only Supabase key used client-side
- All sensitive routes are protected by JWT verification and role/subscription-status middleware on the backend

## Testing Checklist

**Authentication**
- [ ] Register a new user
- [ ] Log in / log out
- [ ] Access protected pages while logged out (should redirect)

**Subscription**
- [ ] Select monthly plan and complete Stripe Checkout
- [ ] Select yearly plan and complete Stripe Checkout
- [ ] Verify active subscription status reflects on dashboard
- [ ] Cancel and verify status updates

**Scores**
- [ ] Add a score
- [ ] Edit a score
- [ ] Delete a score
- [ ] Add a 6th score and verify the oldest is dropped
- [ ] Attempt a duplicate date and verify rejection

**Draws**
- [ ] Simulate a draw (random mode)
- [ ] Simulate a draw (algorithmic mode)
- [ ] Publish a draw and verify winners are generated correctly
- [ ] Verify prize pool math and jackpot rollover behavior

**Charities**
- [ ] Browse and search the charity directory
- [ ] Select a charity and set contribution percentage
- [ ] Confirm selection reflects on the dashboard

**Winners**
- [ ] Submit proof as a winning user
- [ ] Approve/reject as admin
- [ ] Mark an approved winner as paid

**Admin**
- [ ] View and edit users
- [ ] Manage charities (add, spotlight, delete)
- [ ] Run and publish draws
- [ ] Verify winners and payouts
- [ ] Review reports

**Responsive UI**
- [ ] Test on desktop, tablet, and mobile viewports

## Scripts

**Client**
```
npm run dev
npm run build
npm run preview
```

**Server**
```
npm run dev
npm start
```

## License

This project was developed as part of the Digital Heroes trainee selection assignment.

---

Created by - Ritam Chowdhury
