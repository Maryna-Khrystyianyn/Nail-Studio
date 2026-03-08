https://nail-studio-v4us.vercel.app/

# Elegant Nail Studio - Management & Client Platform

A sophisticated, full-stack web application designed for a modern nail design studio. This platform provides a seamless experience for both clients (booking, gallery viewing) and administrators (service management, settings, user control).

## 🚀 Overview

Built with the latest **Next.js 15** and **React 19**, this project focuses on performance, scalability, and a premium user experience. It features complete internationalization (i18n), a robust authentication layer, and a dynamic administrative dashboard.

### Key Features

-   🌐 **Multi-language Support**: Fully localized in English, German, and Ukrainian using `next-intl`.
-   📅 **Session Booking**: Integrated booking system for client appointments.
-   🖼️ **Dynamic Gallery**: High-performance gallery to showcase nail design portfolios.
-   🛠️ **Admin Dashboard**: Comprehensive management interface for services, promotions, and salon settings.
-   🔐 **Secure Authentication**: Role-based access control implemented via `NextAuth.js`.
-   📱 **Responsive Design**: Mobile-first approach using **Tailwind CSS 4**.
-   🗄️ **Database Integrity**: Type-safe database operations with **Prisma ORM**.

---

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Database**: [Prisma](https://www.prisma.io/) with SQLite/PostgreSQL
-   **Authentication**: [NextAuth.js v5](https://authjs.dev/)
-   **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Cloud Storage**: [Supabase](https://supabase.com/) (for media assets)
-   **Icons**: [Lucide React](https://lucide.dev/)

---

## 📥 Getting Started

### Prerequisites

-   Node.js 20+
-   npm / yarn / pnpm

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/nail-studio.git
    cd nail-studio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory and configure the necessary environment variables:
    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="your-secret-key"
    SUPABASE_URL="your-supabase-url"
    SUPABASE_ANON_KEY="your-supabase-key"
    ```

4.  **Database Migration & Seeding**:
    ```bash
    npx prisma migrate dev --name init
    npm run seed # If a seed script is configured in package.json
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Project Structure

```text
├── messages/          # Internationalization dictionaries (en, de, uk)
├── prisma/            # Database schema and migrations
├── public/            # Static assets
└── src/
    ├── app/           # Next.js App Router (localized routes)
    ├── components/    # Reusable UI components
    ├── lib/           # Utility functions and shared logic
    ├── providers/     # Context providers (Auth, i18n)
    └── middleware.ts  # Route protection and i18n middleware
```

---

## 🛡️ Authentication & Security

The system uses role-based access control. Public routes are accessible to all users, while `/admin` and `/dashboard` paths are protected by middleware and require authenticated sessions with appropriate permissions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Developed with ❤️ for the Beauty Industry.*
