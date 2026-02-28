# Noava

A comprehensive flashcard platform designed for students and teachers to make learning simple, accessible, and classroom-ready. Noava combines spaced repetition learning with classroom management tools, enabling educators to create, share, and track student progress on flashcard decks.

## Description

Noava is a modern web-based learning platform that facilitates knowledge retention through flashcard-based studying and spaced repetition techniques. The platform provides a complete ecosystem for both individual learners and educational institutions, featuring deck creation and management, classroom collaboration, school administration, and detailed analytics to track learning progress. Built with a separate frontend and backend architecture, Noava offers a scalable and maintainable solution for digital learning.

## Key Features

- **Flashcard Management**: Create, edit, and organize flashcards into decks with support for rich content including images stored in Azure Blob Storage
- **Spaced Repetition Learning**: Intelligent review system based on spaced repetition algorithms to optimize long-term retention (Leitner Box)
- **Classroom Collaboration**: Teachers can create classrooms, invite students, and assign deck collections for structured learning
- **School Administration**: Multi-level organization with school management capabilities for educational institutions
- **Deck Sharing**: Share decks between users through invitation system and manage deck ownership
- **Progress Analytics**: Comprehensive statistics tracking for individual users, classrooms, and decks
- **Notifications**: Real-time notification system for deck invitations, classroom updates, and more
- **Import/Export**: Support for importing flashcards from CSV and Excel files
- **Internationalization**: Multi-language support with English, French, and Dutch translations
- **Text-to-Speech**: Audio playback support for flashcard content
- **Contact System**: Integrated contact form for user support and feedback

## Installation

### Prerequisites

- Node.js (v18 or higher)
- .NET 8.0
- PostgreSQL 18
- Clerk account for authentication

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/noava
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Configure your secrets (Manage User Secrets in VS)

4. Apply database migrations:
   ```bash
   dotnet ef database update --project noava
   ```

5. Run the backend:
   ```bash
   dotnet run --project noava
   ```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating a `.env` file with all that is needed

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

### Documentation Setup

1. Navigate to the documentation directory:
   ```bash
   cd frontend/docs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the documentation server:
   ```bash
   npm start
   ```

The documentation will be available at `http://localhost:3000`

## Technologies

### Backend

- **Framework**: ASP.NET Core 8.0
- **Database**: PostgreSQL with Entity Framework Core
- **Authentication**: JWT Bearer tokens (via Clerk)
- **Cloud Storage**: Azure Blob Storage
- **Email**: MailKit for email notifications
- **API Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Authentication**: Clerk React SDK
- **Styling**: Tailwind CSS with Flowbite components
- **Internationalization**: i18next with react-i18next
- **Documentation**: Docusaurus

### Infrastructure

- **Database**: PostgreSQL 18

## Authors

- **Youmni Malha**
- **Cedric Pas**
- **Brent Vanroelen**
- **Luna D'Heere**