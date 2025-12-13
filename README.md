# SchoolEm – Production Frontend

This repository is the **production frontend** for **SchoolEm**, a social platform built for college students to connect, collaborate, and discover what’s happening on their campus.

> **Note:** This repo is a fork of [`Wuizlz/schoolem-intro`](https://github.com/Wuizlz/schoolem-intro) and is used as the **deployment source** for the live site.

---

## 🌐 Live Application
## React Compiler (For devs)

- **Production:** https://officialschoolem.org  

(Deployed via Vercel, connected to this repository’s `main` branch.)

---

## 🚀 What is SchoolEm?

SchoolEm is a campus-focused social media platform inspired by apps like Instagram and YikYak.  
It gives students a dedicated space to:

- Post and share updates with their university community  
- Discover and promote clubs, events, and student projects  
- Find study groups and like-minded people  
- Speak more freely than on traditional school-run apps

---

## 🧰 Tech Stack

- **Frontend:** React (SPA)
- **Routing:** React Router
- **Styling:** Tailwind CSS / styled-components (hybrid)
- **State & Data:** React Query + custom hooks
- **Backend-as-a-Service:** Supabase (Postgres, Auth, RLS)
- **Deployment:** Vercel
- **Auth:** Supabase email-based auth (university email domain restricted)

---

## 🗂 Branch & Repo Structure

- **`main`** – Production branch.  
  - Connected to Vercel.
  - Every push to `main` triggers a new production deployment.
- **Feature branches** – For new work (e.g. `feature/new-feed`, `fix/email-flow`).
  - Create PRs into `main` after testing.

Upstream (original dev repo):  
- [`Wuizlz/schoolem-intro`](https://github.com/Wuizlz/schoolem-intro)

This fork (production):  
- [`kishnahai0806/schoolem-intro`](https://github.com/kishnahai0806/schoolem-intro)

---
