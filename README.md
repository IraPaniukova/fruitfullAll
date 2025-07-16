# Fruitfull - Career Networking App

This README describes the current state of Fruitfull. Some planned features are still in progress due to time constraints.

## Description

Fruitfull is a web app designed for career starters—graduates, interns, and entry-level job seekers—to share anonymised interview experiences. Users create posts where they describe their interviews by providing information such as interview questions, optional company name, industry sector, year of the interview (current or previous), country of the vacancy, question type, interview format, stress level (rated 0–5), and personal opinions.

The app includes user profiles where individuals can set their nickname and country (used only for display purposes). Each profile displays a summary of the user’s activity, including the total number of posts and the average stress level across all their shared interviews. From their profile, users can easily view, edit, or delete their own posts.

The dashboard presents recent posts with infinite scroll functionality, allowing users to load more posts as they browse. Industry-based filtering is available directly on the dashboard for easier navigation.

Each post has a dedicated page displaying full post details and user comments. Users can comment on any post, edit or delete their own comments, like or unlike others’ comments, and view like counts.

An about page introduces the app and its purpose, while the platform encourages users to share their interview experiences and engage through comments, helping to build a supportive community focused on peer knowledge sharing and job interview preparation.

## Relation to Networking Theme

Fruitfull fits the Networking theme by connecting mainly entry-level job seekers and interns to share interview experiences and advice, with a focus on preparing for QA and related roles. It creates a supportive community for career starters to learn, reduce stress, and grow through shared knowledge and practical tips.

## Technologies

- **Frontend**: React + TypeScript, MUI (Material UI), Redux, React Router, Axios, SignalR (WebSockets)
- **Backend**: C# with .NET 9, EF Core, ASP.Net, T-SQL Database (SSMS, moved to Azure), SignalR
- **Testing**: Xunit (backend - implemented only for services), Viest (frontend - only 1 working test)
- **Deployment**: Azure

## Implemented Features

- **User Registration & Login**: Local email authentication with hashed passwords (email confirmation not implemented yet — planned feature) and Google authentication.
- **Profiles**: Users can set a nickname, country, app theme (light or dark), year they are members since, and view their total posts and average stress level.
- **Post Management**: Users can create, edit, and delete their own interview posts.
- **Comment Management**: Users can comment on posts, edit or delete their own comments, like/unlike comments, and view like counts.
- **Dashboard**: Shows recent posts with infinite scroll; filter posts by industry.
- **Post Details**: View full post with related comments and interaction options.
- **About Page**: Short app description.
- **Dark/Light Mode**: Users can switch between light and dark mode; preference is saved in their profile.
- **Basic Real-time Updates**: SignalR used for real-time comment updates.
- **State Management**: Redux stores user authentication tokens, user ID, comments, and theme preferences for consistent app state.

## Advanced Requirements Implemented

- Unit testing components (partly)
- Use a state management library (Redux).
- Support theme switching (light/dark mode).
- Implement WebSockets (SygnalR).

## Database Structure

- Users: UserId, Email, PasswordHash (optional), Country (optional), Theme (light/dark), Nickname (optional), ProfileImage (optional), AuthProvider (local/google), GoogleId (optional), CreatedAt
- Roles: RoleId, RoleName
- UserRoles: UserId (FK), RoleId (FK)
- Posts: PostId, Content, Opinion (optional), Company, Industry, Year, Country, StressLevel (0-5), QuestionType, InterviewFormat, UserId (FK, optional), CreatedAt, UpdatedAt (optional), IsDeleted (soft delete), LikesCount
- Comments: CommentId, PostId (FK), UserId (FK), Text, CreatedAt, UpdatedAt (optional), IsDeleted (soft delete), EditCount, LikesCount
- PostLikes: UserId (FK), PostId (FK)
- CommentLikes: UserId (FK), CommentId (FK)
- Tags: TagId, Name
- PostTags: PostId (FK), TagId (FK)
- Reports: ReportId, UserId (FK), PostId (FK, optional), CommentId (FK, optional), Reason, CreatedAt
- AuthTokens: Id, UserId (FK), RefreshToken, ExpiresAt, CreatedAt, RevokedAt (optional)

## Notes

For backend JWT authentication, set these environment variables (example values):
export JWT_SECRET_KEY="a-jwt-key-4f7d9a8c3b2e1f6d0c5a7e9bD8jC0Rx"
export JWT_ISSUER="fruitfullServer"
Also, VITE_API_URL=https://backend-server-url/ in .env
