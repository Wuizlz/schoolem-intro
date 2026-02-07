# SchoolEm — Intro & Prototype

**College is expensive**, and students deserve more than a schedule, a tuition bill, and a diploma that doesn’t show the full story.

My team and I are building **SchoolEm** to help students actually get value out of campus life—**real connections, real opportunities**, and a place to share what they’re doing and becoming.

**Goal:** help students leave college with more than a degree—with **proof of growth, community, and momentum.**

---

## What is `schoolem-intro`?

This repository is an **intro build + prototype** for SchoolEm.

It’s used to:
- Present the **product vision**
- Demonstrate **early user flows**
- Prototype **UI/UX improvements** that will ship in future versions

Think of `schoolem-intro` as the **front door**—a lightweight build that communicates the mission and previews what’s next—while the full SchoolEm application continues evolving separately.

---

## Major Technical Work (Current Version)

### Frontend (React)

- Built with **React 18 + Vite**, optimized for a smooth, **mobile-first** campus feed experience
- Implemented routing with **React Router**, including:
  - **Nested routes**
  - **Modal deep-linking** (open a post as an overlay without losing feed context)
- Used **TanStack React Query** as the data layer for:
  - caching + request deduping
  - **infinite scroll** (`useInfiniteQuery` + cursor pagination)
  - mutations with **optimistic UI updates** (likes/comments feel instant)
- Styled with **Tailwind CSS v4** + **styled-components** (theming) + **Headless UI** (accessible components)
- Built onboarding/auth flows with **React Hook Form** for a clean, multi-step UX

---

### Backend (Supabase / Postgres)

- Backend powered by **Supabase** (**Postgres, Auth, Storage**)
- Modeled content using a **normalized publications system**:
  - `publications` as the base table (**author, type, timestamps, counters**)
  - child tables for post types (e.g. **media posts** + **text threads**) referencing the same publication ID
- Implemented core social interactions with join tables:
  - **likes**, **comment likes**, **follows**, **notifications**
- Supported **threaded comments** via a self-referencing `parent_comment_id`
- Secured access using **Supabase Auth + Row Level Security (RLS)** so users only read/write authorized rows
- Served feed + notification data through **Postgres RPC functions** to:
  - keep **pagination and joins** in the database
  - reduce client complexity
  - improve scalability/consistency

---

### Media Storage

- Used **Supabase Storage** for:
  - post images
  - profile pictures
- Implemented **client-side image downscaling before upload** to reduce bandwidth and improve upload speed

---

### Deployment

- Deployed with **Vercel**
- Configured SPA routing support via `vercel.json`

---

## Preview


### Sign-Up
https://github.com/user-attachments/assets/589dbf33-8b43-4f70-b1e8-a92c171ec1f6

### University Feed
https://github.com/user-attachments/assets/effe9106-c467-47ca-86e4-01be2d678377

### Profile
https://github.com/user-attachments/assets/8a130a1e-4718-4a40-ba77-21a535d0482b

### Settings & 404
https://github.com/user-attachments/assets/bd29ccb0-4d26-4dca-95de-260a99c2b330

---

## Application Focus

SchoolEm fosters a **student-centered ecosystem** aimed at improving campus culture and engagement.

It gives students a place to:
- promote and discover **local gatherings, groups, events, parties**
- support **student-owned businesses**
- share experiences through posts/threads (quick laughs or meaningful moments)
- build real **community + momentum** throughout college