# Blog App

A full-stack blog application built with Next.js, Prisma, and Clerk for authentication. This application allows users to create, read, update, and delete articles, as well as comment on and like them.

![Banner](./screenshot/blog.jpg)

## Features

-   **User Authentication**: Secure sign-up and sign-in functionality using Clerk.
-   **Article Management**:
    -   Create new articles with a rich text editor.
    -   Read articles with a clean and modern interface.
    -   Update existing articles.
    -   Delete articles.
-   **Interactive Features**:
    -   Like and unlike articles.
    -   Comment on articles.
-   **Search**: Find articles by title or content.
-   **Dashboard**: A user-specific dashboard to manage personal articles.
-   **Theming**: Switch between light and dark mode.
-   **Image Uploads**: Upload images for articles using Cloudinary.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database/ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [Clerk](https://clerk.com/)
-   **UI**:
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [Shadcn/ui](https://ui.shadcn.com/)
    -   [Lucide React](https://lucide.dev/guide/packages/lucide-react) (for icons)
    -   [Next-Themes](https://github.com/pacocoursey/next-themes) (for theming)
    -   [React Quill](https://github.com/zenoamaro/react-quill) (for rich text editor)
-   **Image Management**: [Cloudinary](https://cloudinary.com/)
-   **Validation**: [Zod](https://zod.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v20 or later)
-   npm or yarn
-   A PostgreSQL database

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sandeep-singh-99/blog_app.git
    cd blog_app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following environment variables. You can get the necessary keys from the respective services.

    ```env
    # Prisma
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

    # Cloudinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    NEXT_PUBLIC_CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    ```

4.  **Run database migrations:**
    This will apply the existing database schema to your database.
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
