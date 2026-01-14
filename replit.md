# EduBridge Learning

## Overview

EduBridge Learning is an online tutoring platform landing page for students in Grades 1-10. The application is a React-based single-page application with an Express backend, featuring a polished marketing landing page with premium animations and a strict design system. The project connects students with expert tutors for personalized online learning experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: TailwindCSS with custom CSS variables for brand colors
- **Animations**: Framer Motion for scroll-triggered animations and micro-interactions
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **State Management**: TanStack React Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful API endpoints prefixed with `/api`
- **Storage**: Abstracted storage interface (`IStorage`) with in-memory implementation, ready for database integration

### Design System
The project follows strict design guidelines defined in `design_guidelines.md`:
- Fixed brand color palette using CSS variables (blue, mint, yellow, pink, navy, ink, muted)
- Inter font family with specific weights for headings and body text
- Extra-rounded border radii (28-36px for cards, pill buttons)
- Mobile-first responsive design
- Accessibility: respects `prefers-reduced-motion` for animations

### Media Assets
- **Hero Video**: `gemini_generated_video_1E4A2E5D_1768386171250.mp4` - autoplays muted, looping
- **Student Images**: 
  - `IMG_7559_1768386171250.jpeg` - 3 students with headphones (used in FinalCTA)
  - `IMG_7561_1768386171250.jpeg` - 3 happy students celebrating (used in Subjects)
  - `imgur_image_1.webp` - student image (used in PerfectFor)
  - `imgur_image_2.webp` - students learning (used in WhyChoose)
- All images have 28px border radius and shadow-xl styling
- Section headers have a blue decorative line above the kicker text for visual alignment

### Build System
- Development: Vite dev server with HMR
- Production: Custom build script using esbuild for server bundling and Vite for client
- Path aliases configured: `@/` for client source, `@shared/` for shared code

### Database Schema
- Uses Drizzle ORM with PostgreSQL dialect
- Schema defined in `shared/schema.ts`
- Currently has a users table with id, username, and password fields
- Zod integration via drizzle-zod for schema validation

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and migrations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI/Component Libraries
- **Radix UI**: Headless UI primitives (dialog, dropdown, accordion, etc.)
- **shadcn/ui**: Pre-built component system built on Radix
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **Embla Carousel**: Carousel component

### Development Tools
- **Replit Vite Plugins**: Runtime error overlay, cartographer, dev banner
- **TypeScript**: Static type checking
- **PostCSS/Autoprefixer**: CSS processing

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Zod resolver for React Hook Form