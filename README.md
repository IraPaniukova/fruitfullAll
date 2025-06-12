# Fruitfull - Career Networking App (Planned)

**Note:** This README describes the planned features and implementation of Fruitfull. Content and functionality may change as development progresses.

## Description

Fruitfull is a web app where career starters—graduates, interns, and entry-level job seekers, and anyone interested—share anonymized interview experiences. Users post interview questions, rate stress levels (1–5), specify company and role, and share tips. The platform includes profiles, search filters, and a Q\&A forum to build a supportive community that helps reduce interview anxiety through peer insights.

## Relation to Networking Theme

Fruitfull fits the Networking theme by connecting mainly entry-level job seekers and interns to share interview experiences and advice, with a focus on preparing for QA and related roles. It creates a supportive community for career starters to learn, reduce stress, and grow through shared knowledge and practical tips.

## Technologies Planned

- **Frontend**: React + TypeScript, MUI (Material UI), React Router, Redux
- **Backend**: C# with .NET 8, Entity Framework Core, Azure SQL Database
- **Testing**: Jest (frontend), xUnit (backend)
- **Deployment**: Azure Static Web Apps (frontend), Azure App Service (backend)
- **Optional**: WebSockets using Azure Web PubSub for real-time features

## Planned Features

- Anonymous posts by default
- Optional nickname and avatar for profile identity
- Users can create, edit, or delete their own posts
- Q&A section for career-related questions and answers
- Search and filter by company, industry, country
- Light/dark theme toggle stored in local storage

## Database Structure (Simplified)

- **Users**: ID, Email, PasswordHash, Nickname (optional), AvatarUrl (optional), CreatedAt
- **InterviewPosts**: ID, UserID, Company, Role, Questions, StressLevel, Outcome, Tips, CreatedAt
- **QAThreads**: ID, UserID, Question, CreatedAt
- **QAResponses**: ID, ThreadID, UserID, Response, CreatedAt

## Git & Deployment

- Version control with meaningful commit messages (e.g., "Create interview post model", "Add dark mode toggle")
- Frontend deployed via **Azure Static Web Apps** (free tier)
- Backend deployed via **Azure App Service** (free tier)

## Notes

- Real user data is hidden; only nicknames or labels are shown
- WebSockets for real-time features (chat, notifications) are optional
- The app focuses on early-career support but is open to anyone
