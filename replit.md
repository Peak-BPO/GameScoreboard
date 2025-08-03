# Overview

GameScore Pro is a modern score-tracking web application for multiplayer games. The app allows users to add players, track scores across multiple rounds, view statistics, and manage game history. Built with a React frontend and Express backend, it provides a clean, responsive interface optimized for mobile devices with the potential for future mobile app deployment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Built on shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark modes)
- **State Management**: React hooks with local component state, no global state management
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management and caching

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with `/api` prefix for all endpoints
- **Data Storage**: In-memory storage using Map data structures (MemStorage class)
- **Development**: Hot module replacement with Vite integration for seamless development experience

## Data Storage Solutions
- **Primary Storage**: Browser localStorage for persisting game data locally
- **Game Limit**: Maximum of 15 saved games with automatic cleanup of oldest games
- **Data Models**: Strongly typed schemas using Zod for validation
  - **Game**: Contains players, rounds, timestamps, and metadata
  - **Player**: Individual player data with totals and statistics
  - **Round**: Score data for each round with timestamps

## Client-Side Data Management
- **Local Storage Strategy**: Games are stored as JSON in localStorage with a dedicated service layer
- **Data Validation**: Zod schemas ensure type safety and data integrity
- **Statistics Calculation**: Real-time calculation of player stats (totals, averages, highest scores)
- **Game History**: Chronological storage with the ability to load and continue previous games

## User Interface Design
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Component Structure**: Modular component architecture with reusable UI elements
- **Modal System**: Dedicated modals for score entry, statistics, and saved games
- **Interactive Tables**: Editable score tables with frozen header rows for totals
- **Toast Notifications**: User feedback system for actions and validation errors

## Development Environment
- **Build System**: Vite with TypeScript compilation and hot reloading
- **Code Quality**: TypeScript for type safety with strict configuration
- **Styling System**: PostCSS with Tailwind CSS and autoprefixer
- **Development Tools**: ESBuild for production builds and server bundling

# External Dependencies

## UI and Styling
- **@radix-ui/react-***: Comprehensive set of unstyled, accessible UI primitives for all interactive components
- **tailwindcss**: Utility-first CSS framework for responsive design
- **class-variance-authority**: Type-safe utility for managing component variants
- **clsx**: Utility for constructing conditional className strings

## State Management and Data Fetching
- **@tanstack/react-query**: Server state management with caching, background updates, and optimistic updates
- **react-hook-form**: Performant forms with easy validation and minimal re-renders
- **@hookform/resolvers**: Validation resolvers for react-hook-form integration

## Validation and Schemas
- **zod**: TypeScript-first schema validation for runtime type checking
- **drizzle-zod**: Integration between Drizzle ORM and Zod for database schema validation

## Database and ORM
- **drizzle-orm**: TypeScript ORM configured for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **drizzle-kit**: Database migration and introspection toolkit

## Development and Build Tools
- **vite**: Fast build tool and development server with React plugin
- **tsx**: TypeScript execution engine for running TypeScript files directly
- **esbuild**: Fast JavaScript bundler for production builds
- **wouter**: Lightweight routing library for React applications

## Utilities and Helpers
- **nanoid**: Cryptographically secure URL-safe unique ID generator
- **date-fns**: Modern JavaScript date utility library for date manipulation
- **cmdk**: Command palette component for keyboard navigation
- **embla-carousel-react**: Carousel component for image/content sliding

## Session Management (Configured but unused)
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **express-session**: Session middleware for user session management