College is expensive, and students deserve more than a schedule, a tuition bill, and a diploma that doesn’t show the full story. My team and I are building SchoolEm to help students actually get value out of campus life—real connections, real opportunities, and a place to share what they’re doing and becoming. Our goal is simple: help students leave college with more than a degree—with proof of growth, community, and momentum.

## What is `schoolem-intro`?

This repo is an **intro + prototype** for SchoolEm. It’s used to present the product vision, demonstrate early user flows, and prototype UI/UX improvements that will ship in the next version of the platform.

In short: `schoolem-intro` is the **front door**—a lightweight build that communicates the mission and previews what’s next—while the full SchoolEm application continues evolving.

## Major Technical Work (Current Version)

### Frontend (React)
- Built the UI with **React 18 + Vite**, optimized for a smooth, mobile-first campus feed experience.
- Implemented routing with **React Router** including **nested routes** and **modal deep-linking** (users can open a post as an overlay without losing feed context).
- Used **TanStack React Query** as the data layer for:
  - caching and request deduping
  - **infinite scroll** (useInfiniteQuery + cursor pagination)
  - mutations with **optimistic UI updates** (likes/comments feel instant)
- Styled with **Tailwind CSS v4** utilities plus **styled-components** for theming, and **Headless UI** for accessible components.
- Built onboarding/auth forms with **React Hook Form** for a clean, multi-step UX.

### Backend (Supabase / Postgres)
- Shipped the backend using **Supabase** (Postgres, Auth, Storage) with a schema designed for a real social platform.
- Modeled content using a **normalized publications system**:
  - `publications` as the base table (author, type, timestamps, counters)
  - child tables for post types (e.g., **media posts** and **text threads**) referencing the same publication ID
- Implemented core social interactions with join tables:
  - **likes**, **comment likes**, **follows**, and **notifications**
  - **threaded comments** supported through a self-referencing `parent_comment_id`
- Built a secure user system using **Supabase Auth** + **Row Level Security (RLS)** so users can only access rows they’re authorized to read/write.
- Served feed + notification data through **server-side Postgres functions (RPC)** to keep pagination and joins in the database (more scalable and consistent than doing heavy joins client-side).

### Storage (Media)
- Used **Supabase Storage** for post images and profile pictures.
- Implemented client-side **image downscaling before upload** to reduce bandwidth and improve upload speed.

### Deployment
- Deployed with **Vercel**, including SPA routing support via `vercel.json`.

### Preview 
  ### Sign-Up
https://github.com/user-attachments/assets/589dbf33-8b43-4f70-b1e8-a92c171ec1f6
  ### Uni && Settings
https://github.com/user-attachments/assets/741ed499-0365-4713-97c6-25a53bb99d3a




