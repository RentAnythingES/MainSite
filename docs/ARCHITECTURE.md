# RentAnything.es — Architecture
> Status: 🔲 Scaffold — to be populated

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend
- **Hosting**: Vercel
- **Domain**: rentanything.es

## Data Flow
```
Supabase (PostgreSQL)
  ↓ queries.ts
Next.js Server Components
  ↓ props
Client Components (BookingWidget, ContactForm)
  ↓ fetch
API Routes (/api/bookings, /api/contact)
  ↓ service client
Supabase (write)
```

## Environment Variables
See `.env.example` for the full list.
