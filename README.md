# 📡 SMARTTECH-GUIDE

> A modern, full-stack tech blogging & knowledge-sharing platform built with Next.js 15, Prisma, and Tailwind CSS.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## ✨ Features

- 📝 **Blog Management** — Create, edit, publish, and categorize posts with rich content
- 🔐 **Admin Authentication** — Secure login with NextAuth.js & bcrypt password hashing
- 🖼️ **Cloudinary Media** — Cloud-based image uploads and optimization
- 🗂️ **Category System** — Organize posts into categories with slugs
- ⚙️ **Site Settings** — Dynamic control over hero text, ticker items, footer, and branding
- 🎞️ **Framer Motion** — Smooth page transitions and UI animations
- 📱 **Fully Responsive** — Mobile-first design across all devices
- 🌙 **Dark Mode Ready** — Theming support out of the box

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js 15 (App Router)             |
| Language     | TypeScript 5                        |
| Styling      | Tailwind CSS v4                     |
| Database     | SQLite (dev) via Prisma ORM         |
| Auth         | NextAuth.js v4                      |
| Media        | Cloudinary                          |
| Animations   | Framer Motion                       |
| Validation   | Zod                                 |
| Icons        | Lucide React                        |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/SMARTTECH-GUIDE.git
cd SMARTTECH-GUIDE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
# Auth
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Set up the database

```bash
npx prisma db push
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
smarttech-guide/
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.ts            # Seed script
├── src/
│   ├── app/               # Next.js App Router pages & API routes
│   ├── components/        # Reusable UI components
│   └── lib/               # Utility functions & helpers
├── .env.example           # Environment variable template
├── next.config.ts
└── tailwind.config.ts
```

---

## 🗄️ Database Models

- **User** — Admin users with role-based access
- **Post** — Blog posts with slug, cover image, and publish status
- **Category** — Post categories with unique slugs
- **SiteSettings** — Global site configuration (singleton)

---

## 🔑 Admin Access

After seeding, log in at `/admin/login` with the credentials defined in `prisma/seed.ts`.

---

## 📦 Scripts

| Command              | Description                       |
|----------------------|-----------------------------------|
| `npm run dev`        | Start development server          |
| `npm run build`      | Build for production              |
| `npm run start`      | Start production server           |
| `npm run lint`       | Run ESLint                        |
| `npx prisma studio`  | Open Prisma DB GUI                |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Made with ❤️ by [Md. Mirazul Hasan](https://github.com/YOUR_USERNAME)
