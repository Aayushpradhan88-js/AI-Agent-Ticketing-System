AI Agent Ticketing System – Backend

# Backend for an AI-assisted ticketing system with:
•  JWT auth + Google OAuth
•  Onboarding flow (student / moderator / admin)
•  Ticket creation and management
•  AI-powered ticket analysis (priority, notes, skills)
•  Auto-assignment to moderators + email notifications
•  Admin tools for users and tickets

# Tech Stack
•  Runtime: Node.js, Express
•  Database: MongoDB (Mongoose)
•  Auth: JWT + Passport Google OAuth
•  Background jobs: Inngest
•  AI: Gemini (via custom analyzeTicket utility)
•  Email: Nodemailer + Mailtrap
•  Dev tools: Nodemon, ESLint, Prettier

Getting Started

1. Install bash
 - cd server
 -npm install

2. Environment Variables
MONGO_URI=mongodb://localhost:27017/ai-ticketing
PORT=3000
CLIENT_URL=http://localhost:5173

JWT_SECRET=your-very-long-secret-at-least-32-chars
JWT_TOKEN_EXPIRY_DATE=7D
SESSION_SECRET=some-session-secret

MAILTRAP_SMTP_HOST=...
MAILTRAP_SMTP_PORT=...
MAILTRAP_SMTP_USER=...
MAILTRAP_SMTP_PASS=...

GEMINI_API_KEY=...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
APP_URL=http://localhost:3000

INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

3. Run Dev Server
 - npm run dev
•  Server: http://localhost:3000
•  API base: http://localhost:3000/api/v1

Core Features

1. Authentication & Users
# JWT Auth
•  Register
•  Login
•  Logout (JWT)
•  Get current user (/me)

Google OAuth (optional)
•  GET /api/v1/auth/google
•  GET /api/v1/auth/google/callback

# Admin User Management
•  Get all users
•  Update user (admin)
•  Delete user (admin)
•  Toggle user status (active / inactive)

2. Onboarding
On first login, user completes onboarding:

•  Choose role: student | moderator | admin
•  Fill basic info (interest, experience, etc.)
•  Backend stores:
•  onboardingData
•  onboardingCompleted
•  onboardingCompletedAt

Note: Certain routes (like viewing tickets) require onboarding to be completed.  
This is enforced by checkOnboarding middleware.

3. Tickets

# Regular User
•  Create ticket:
•  Title
•  Description
•  1–4 hashtags (e.g. ["backend", "bug"])
•  Get own tickets
•  Get ticket by ID (only if they created it)

# Admin / Moderator
•  See all tickets
•  Assign ticket to a user (usually a moderator)
•  Update ticket status (active, in-progress, resolved, closed)
•  Delete ticket (admin only)

4. AI & Background Processing
On Signup (user/signup event):

•  Inngest function onSigningUp:
•  Loads user by email
•  Sends welcome email via Mailtrap

On Ticket Created (ticket/created event):

Inngest function onTicketCreated:

1. Fetches the ticket
2. Sets status to "In progress"
3. Uses analyzeTicket (Gemini) to:
•  Suggest priority
•  Generate helpfulNotes
•  Infer relatedSkills
4. Updates the ticket with these fields
5. Finds a matching moderator by skills (or falls back to an admin)
6. Assigns the ticket
7. Sends email notification to the assignee

This keeps the HTTP request fast and moves heavy work (AI + emails) to background jobs.

# API Overview (Short Version)

Base: /api/v1
Auth – /auth

•  POST /register – Create account + return JWT
•  POST /login – Login + return JWT
•  POST /logout – Logout (JWT)
•  POST /logout/session – Logout for Google OAuth session
•  GET /me – Current user (JWT or session)

Admin only:
•  GET /get-users-account
•  PATCH /admin/user/:userId/update-account
•  DELETE /admin/user/:userId
•  GET /admin/user/:userId/status – Toggle or set status

Onboarding – /onboarding
•  POST /submit – Complete onboarding (role + answers)
•  GET /check – Check onboarding status

Tickets – /tickets
•  POST /create-ticket – Create ticket (JWT)
•  GET /get-all-tickets – List:
•  Admin/moderator: all
•  User: own
•  GET /get-ticket/:id – Ticket by ID:
•  Admin: any
•  User: own only

Admin / Moderator:
•  POST /admin/assign/:ticketId – Assign/unassign ticket
•  PATCH /admin/status/:ticketId – Update status

Admin:
•  DELETE /admin/delete/:ticketId – Delete ticket