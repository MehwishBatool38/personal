# Mehwish Batool Portfolio

A modern, responsive personal portfolio built with React 19, Vite, and Supabase.

## ✨ Features
- **Modern UI/UX**: Clean design with smooth animations and transitions.
- **Dynamic Content**: Managed via a secure admin dashboard.
- **Supabase Integration**: Real-time database and storage for projects and profile info.
- **CV Generation**: Automatic PDF generation from profile data.
- **Responsive**: Fully optimized for mobile, tablet, and desktop.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vanilla CSS
- **Bundler**: Vite
- **Backend**: Supabase (PostgreSQL + Storage)
- **Deployment**: Ready for GitHub Pages / Vercel

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root with:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_PASS=mehwish2024
   ```

3. **Run locally**:
   ```bash
   npm run dev
   ```

## 🔐 Admin Panel
Access the admin panel at `your-site.com/#admin`.
- **Default Password**: `mehwish2024`

## 📦 Database Setup
Ensure you have the following tables in Supabase:
- `profile`: Single row with `name`, `bio`, `profile_pic`, `cv_url`, etc.
- `web_projects`: Project data for web apps.
- `app_projects`: Project data for mobile apps.

**Storage**: Create a **public** bucket named `portfolio-images` for image and CV uploads.

---
Created by Mehwish Batool
