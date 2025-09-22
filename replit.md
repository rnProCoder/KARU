# Daily Tasks - Task Management Application

## Overview

This is a full-stack task management application built with a React frontend and Express.js backend. The application provides a calendar-based interface for managing daily tasks, allowing users to create, edit, complete, and delete tasks organized by date. The system features a responsive design with mobile-friendly navigation and uses a modern tech stack including shadcn/ui components, TanStack Query for state management, and Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Date Handling**: date-fns library for date manipulation and formatting
- **Form Handling**: React Hook Form with Zod validation resolvers

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with endpoints for task CRUD operations
- **Validation**: Zod schemas for request validation and type safety
- **Storage**: Abstracted storage interface supporting both in-memory and database implementations
- **Development**: Hot module replacement with Vite middleware integration

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (via Neon serverless driver)
- **Schema**: Simple task table with UUID primary keys, text content, completion status, date association, and timestamps
- **Migrations**: Drizzle Kit for schema migrations and database management
- **Fallback**: In-memory storage implementation for development/testing

### Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Express session configuration present but not actively used
- **Security**: Basic CORS and request parsing middleware

### External Dependencies
- **Database Provider**: Neon Database (PostgreSQL-compatible serverless database)
- **UI Component Library**: Radix UI for accessible, unstyled components
- **Icon Library**: Lucide React for consistent iconography
- **Font Services**: Google Fonts (Inter font family)
- **Development Tools**: Replit-specific plugins for development environment integration

### Key Architectural Decisions

1. **Monorepo Structure**: Client, server, and shared code organized in a single repository with TypeScript path mapping
2. **Type Safety**: End-to-end TypeScript with shared schemas between frontend and backend
3. **Component Architecture**: Composition-based UI using shadcn/ui patterns with customizable variants
4. **Data Fetching**: Query-based approach with automatic caching and background refetching
5. **Responsive Design**: Mobile-first approach with collapsible sidebar and adaptive layouts
6. **Build Strategy**: Client-server bundling with separate build processes for frontend and backend
7. **Environment Flexibility**: Support for both production database and development in-memory storage

### API Structure
- `GET /api/tasks/:date` - Retrieve tasks for a specific date
- `GET /api/tasks` - Retrieve all tasks (for calendar overview)
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task

The architecture prioritizes developer experience with hot reloading, type safety, and modular components while maintaining a clean separation between client and server concerns.