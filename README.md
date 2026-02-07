1| College is expensive, and students deserve more than a schedule, a tuition bill, and a diploma that doesn’t show the full story. My team and I are building SchoolEm to help students actually get value out of campus life—real connections, real opportunities, and a place to share what they’re doing and becoming. Our goal is simple: help students leave college with more than a degree—with proof of growth, community, and momentum.
2| 
3| ## What is `schoolem-intro`?
4| 
5| This repo is an **intro + prototype** for SchoolEm. It’s used to present the product vision, demonstrate early user flows, and prototype UI/UX improvements that will ship in the next version of the platform.
6| 
7| In short: `schoolem-intro` is the **front door**—a lightweight build that communicates the mission and previews what’s next—while the full SchoolEm application continues evolving.
8| 
9| ## Major Technical Work (Current Version)
10| 
11| ### Frontend (React)
12| - Built the UI with **React 18 + Vite**, optimized for a smooth, mobile-first campus feed experience.
13| - Implemented routing with **React Router** including **nested routes** and **modal deep-linking** (users can open a post as an overlay without losing feed context).
14| - Used **TanStack React Query** as the data layer for:
15|   - caching and request deduping
16|   - **infinite scroll** (useInfiniteQuery + cursor pagination)
17|   - mutations with **optimistic UI updates** (likes/comments feel instant)
18| - Styled with **Tailwind CSS v4** utilities plus **styled-components** for theming, and **Headless UI** for accessible components.
19| - Built onboarding/auth forms with **React Hook Form** for a clean, multi-step UX.
20| 
21| ### Backend (Supabase / Postgres)
22| - Shipped the backend using **Supabase** (Postgres, Auth, Storage) with a schema designed for a real social platform.
23| - Modeled content using a **normalized publications system**:
24|   - `publications` as the base table (author, type, timestamps, counters)
25|   - child tables for post types (e.g., **media posts** and **text threads**) referencing the same publication ID
26| - Implemented core social interactions with join tables:
27|   - **likes**, **comment likes**, **follows**, and **notifications**
28|   - **threaded comments** supported through a self-referencing `parent_comment_id`
29| - Built a secure user system using **Supabase Auth** + **Row Level Security (RLS)** so users can only access rows they’re authorized to read/write.
30| - Served feed + notification data through **server-side Postgres functions (RPC)** to keep pagination and joins in the database (more scalable and consistent than doing heavy joins client-side).
31| 
32| ### Storage (Media)
33| - Used **Supabase Storage** for post images and profile pictures.
34| - Implemented client-side **image downscaling before upload** to reduce bandwidth and improve upload speed.
35| 
36| ### Deployment
37| - Deployed with **Vercel**, including SPA routing support via `vercel.json`.
38| 
39| ### Preview 
40|   ### Sign-Up
41| https://github.com/user-attachments/assets/589dbf33-8b43-4f70-b1e8-a92c171ec1f6
42|   ### Uni
43| https://github.com/user-attachments/assets/effe9106-c467-47ca-86e4-01be2d678377
44|   ### Profile
45| https://github.com/user-attachments/assets/8a130a1e-4718-4a40-ba77-21a535d0482b
46|   ### Settings && 404
47| https://github.com/user-attachments/assets/bd29ccb0-4d26-4dca-95de-260a99c2b330
48| 
49| ## Application's Main Point
50| 
51| SchoolEm fosters a student-centered ecosystem aimed at improving campus culture and engaging university students. This application allows students to take full advantage of university-based social platforms, promoting local gatherings, groups, events, parties, and even businesses students may own. Furthermore, it creates a space for students to express their experiences, share a quick laugh, or exchange meaningful moments with their peers.