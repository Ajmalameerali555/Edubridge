# EduBridge Learning

## Overview

EduBridge Learning is an online tutoring platform for students in Grades 1-10. The application features a premium marketing landing page with sophisticated animations, a comprehensive educational assessment system, and a user portal for tracking assessment status. The project connects students with expert tutors for personalized online learning experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **User Authentication System**: Added email/password registration and login with secure session management
- **Assessment Modal**: 7-step questionnaire with password creation for account setup
- **User Dashboard**: Personal portal showing profile, student info, and assessment status
- **Login Modal**: Returning users can sign in to access their dashboard
- **Database Integration**: PostgreSQL with users and assessments tables

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
- **Authentication**: Email/password with bcrypt password hashing
- **Sessions**: PostgreSQL-backed sessions with connect-pg-simple
- **Storage**: DatabaseStorage class using Drizzle ORM

### API Endpoints
- `POST /api/auth/register` - Register new user with assessment
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and destroy session
- `GET /api/auth/me` - Get current authenticated user
- `GET /api/assessments` - Get user's assessments

### Database Schema
- **users**: id, email, password (hashed), parentName, studentName, mobile, grade, createdAt
- **assessments**: id, userId, learningStyle, academicFocus, studyHabits, focusAttention, motivation, additionalNotes, status, createdAt
- **user_sessions**: Session storage table (auto-created)

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

### User Flow
1. **New Users**: Click "GET STARTED" → Complete 7-step assessment → Create password → View report → Submit → Dashboard
2. **Returning Users**: Click "LOG IN" → Enter credentials → Dashboard

### Key Components
- `AssessmentModal.tsx` - Multi-step assessment form with PDF/PNG report generation
- `LoginModal.tsx` - Login form for returning users
- `Dashboard.tsx` - User portal with profile and assessment status
- `Navbar.tsx` - Navigation with GET STARTED and LOG IN buttons

### Build System
- Development: Vite dev server with HMR
- Production: Custom build script using esbuild for server bundling and Vite for client
- Path aliases configured: `@/` for client source, `@shared/` for shared code

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and migrations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Security
- **bcryptjs**: Password hashing
- **express-session**: Session management with secure cookies (sameSite: lax, httpOnly)

### UI/Component Libraries
- **Radix UI**: Headless UI primitives (dialog, dropdown, accordion, etc.)
- **shadcn/ui**: Pre-built component system built on Radix
- **Lucide React**: Icon library
- **Framer Motion**: Animation library
- **html2canvas & jspdf**: PDF/PNG report generation

### Development Tools
- **Replit Vite Plugins**: Runtime error overlay, cartographer, dev banner
- **TypeScript**: Static type checking
- **PostCSS/Autoprefixer**: CSS processing

### Form & Validation
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Zod resolver for React Hook Form

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Secret for session signing (required)
